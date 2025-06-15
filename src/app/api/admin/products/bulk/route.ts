import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bulkActionSchema = z.object({
  action: z.enum(['activate', 'deactivate', 'delete']),
  productIds: z.array(z.string()).min(1, 'At least one product ID is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validationResult = bulkActionSchema.safeParse(body)
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

    const { action, productIds } = validationResult.data

    // Verify all products exist
    const existingProducts = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: { id: true }
    })

    if (existingProducts.length !== productIds.length) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Some products not found' 
        },
        { status: 404 }
      )
    }

    let result
    let message

    switch (action) {
      case 'activate':
        result = await prisma.product.updateMany({
          where: {
            id: {
              in: productIds
            }
          },
          data: {
            isActive: true,
            updatedAt: new Date()
          }
        })
        message = `Successfully activated ${result.count} products`
        break

      case 'deactivate':
        result = await prisma.product.updateMany({
          where: {
            id: {
              in: productIds
            }
          },
          data: {
            isActive: false,
            updatedAt: new Date()
          }
        })
        message = `Successfully deactivated ${result.count} products`
        break

      case 'delete':
        // First check if any products are referenced in orders
        const ordersWithProducts = await prisma.orderItem.findMany({
          where: {
            productId: {
              in: productIds
            }
          },
          select: { productId: true }
        })

        if (ordersWithProducts.length > 0) {
          const referencedProductIds = [...new Set(ordersWithProducts.map(item => item.productId))]
          return NextResponse.json(
            { 
              success: false, 
              error: `Cannot delete products that are referenced in orders. ${referencedProductIds.length} products have existing orders.`
            },
            { status: 400 }
          )
        }

        result = await prisma.product.deleteMany({
          where: {
            id: {
              in: productIds
            }
          }
        })
        message = `Successfully deleted ${result.count} products`
        break

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action' 
          },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      message,
      affectedCount: result.count
    })

  } catch (error) {
    console.error('Bulk action error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform bulk action' 
      },
      { status: 500 }
    )
  }
}
