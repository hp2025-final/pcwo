import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { productSchema } from '@/lib/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } }
      }
    })

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Product not found' 
        },
        { status: 404 }
      )
    }    // Parse JSON fields and map database fields to frontend fields
    const productData = {
      ...product,
      specifications: product.specifications ? JSON.parse(product.specifications) : null,
      images: product.images ? JSON.parse(product.images) : [],
      tags: product.tags ? JSON.parse(product.tags) : [],
      compatibility: product.compatibility ? JSON.parse(product.compatibility) : null,
      dimensions: product.dimensions ? JSON.parse(product.dimensions) : null,
    }

    return NextResponse.json({
      success: true,
      product: productData
    })
  } catch (error) {
    console.error('Product fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product' 
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
    console.log('Received update data:', JSON.stringify(body, null, 2))
    
    // Convert string numbers to actual numbers
    if (body.price !== undefined) body.price = Number(body.price)
    if (body.costPrice !== undefined) body.costPrice = Number(body.costPrice)
    if (body.comparePrice !== undefined) body.comparePrice = Number(body.comparePrice)
    if (body.stock !== undefined) body.stock = Number(body.stock)
    if (body.lowStockThreshold !== undefined) body.lowStockThreshold = Number(body.lowStockThreshold)
    if (body.weight !== undefined) body.weight = Number(body.weight)
    
    // Generate slug from name if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
    
    // Validate input
    const validationResult = productSchema.partial().safeParse(body)
    if (!validationResult.success) {
      console.error('Validation errors:', validationResult.error.errors)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid input',
          details: validationResult.error.errors
        },
        { status: 400 }
      )
    }

    const productData = validationResult.data    // Map frontend fields to database fields
    const updateData: Record<string, unknown> = {
      ...productData,
      // Handle JSON fields
      specifications: productData.specifications ? JSON.stringify(productData.specifications) : undefined,
      images: productData.images ? JSON.stringify(productData.images) : undefined,
      tags: productData.tags ? JSON.stringify(productData.tags) : undefined,
      compatibility: productData.compatibility ? JSON.stringify(productData.compatibility) : undefined,
      dimensions: productData.dimensions ? JSON.stringify(productData.dimensions) : undefined,
      updatedAt: new Date()
    }    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product
    })
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product' 
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
    await prisma.product.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product' 
      },
      { status: 500 }
    )
  }
}
