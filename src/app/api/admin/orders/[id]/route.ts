import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const orderUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']).optional(),
  trackingNumber: z.string().optional(),
  notes: z.string().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { 
                id: true, 
                name: true, 
                sku: true,
                images: true 
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const orderData = {
      ...order,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null,
      billingAddress: order.billingAddress ? JSON.parse(order.billingAddress) : null,
      items: order.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images ? JSON.parse(item.product.images) : []
        }
      }))
    }

    return NextResponse.json({
      success: true,
      order: orderData
    })
  } catch (error) {
    console.error('Order fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Validate input
    const validationResult = orderUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const data = validationResult.data    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    })

    if (!existingOrder) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )    }
      // Update order
    await prisma.order.update({
      where: { id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.trackingNumber !== undefined && { trackingNumber: data.trackingNumber }),
        ...(data.notes !== undefined && { internalNotes: data.notes }),
        updatedAt: new Date()
      }
    })    // Fetch updated order with items
    const orderWithItems = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { 
                id: true, 
                name: true, 
                sku: true,
                images: true 
              }
            }
          }
        }
      }    })

    if (!orderWithItems) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found after update' 
        },
        { status: 404 }
      )
    }

    // Parse JSON fields
    const orderData = {
      ...orderWithItems,
      shippingAddress: orderWithItems.shippingAddress ? JSON.parse(orderWithItems.shippingAddress) : null,
      billingAddress: orderWithItems.billingAddress ? JSON.parse(orderWithItems.billingAddress) : null,
      items: orderWithItems.items.map(item => ({
        ...item,
        product: {
          ...item.product,
          images: item.product.images ? JSON.parse(item.product.images) : []
        }
      }))
    }

    return NextResponse.json({
      success: true,
      order: orderData
    })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update order' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id }
    })

    if (!order) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Order not found' 
        },
        { status: 404 }
      )    }

    // Only allow deletion of cancelled orders
    if (order.status !== 'CANCELLED') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Only cancelled orders can be deleted' 
        },
        { status: 400 }
      )
    }    // Delete order (cascade will delete order items)
    await prisma.order.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })
  } catch (error) {
    console.error('Order delete error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete order' 
      },
      { status: 500 }
    )
  }
}
