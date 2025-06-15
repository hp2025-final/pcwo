import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/shops/[id]/products - Get products in shop
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const [shopProducts, total] = await Promise.all([
      prisma.shopProduct.findMany({
        where: { shopId: id },
        include: {
          product: {
            include: {
              category: true,
              brand: true
            }
          }
        },
        orderBy: { sortOrder: 'asc' },
        skip,
        take: limit
      }),
      prisma.shopProduct.count({
        where: { shopId: id }
      })
    ])

    return NextResponse.json({
      success: true,
      products: shopProducts.map(sp => sp.product),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching shop products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/shops/[id]/products - Add products to shop
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const schema = z.object({
      productIds: z.array(z.string()).min(1, 'At least one product is required')
    })

    const { productIds } = schema.parse(body)

    // Check if shop exists
    const shop = await prisma.shop.findUnique({
      where: { id }
    })

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Check if products exist
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds }
      }
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { success: false, error: 'Some products not found' },
        { status: 404 }
      )
    }

    // Get existing products in shop to avoid duplicates
    const existingShopProducts = await prisma.shopProduct.findMany({
      where: {
        shopId: id,
        productId: { in: productIds }
      }
    })

    const existingProductIds = existingShopProducts.map(sp => sp.productId)
    const newProductIds = productIds.filter(pid => !existingProductIds.includes(pid))

    if (newProductIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'All products are already in this shop' },
        { status: 400 }
      )
    }

    // Get next sort order
    const lastProduct = await prisma.shopProduct.findFirst({
      where: { shopId: id },
      orderBy: { sortOrder: 'desc' }
    })

    const startSortOrder = (lastProduct?.sortOrder || 0) + 1

    // Add products to shop
    const shopProductsData = newProductIds.map((productId, index) => ({
      shopId: id,
      productId,
      sortOrder: startSortOrder + index
    }))

    await prisma.shopProduct.createMany({
      data: shopProductsData
    })

    return NextResponse.json({
      success: true,
      message: `${newProductIds.length} products added to shop`,
      addedCount: newProductIds.length,
      skippedCount: existingProductIds.length
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error adding products to shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add products to shop' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/shops/[id]/products - Remove products from shop
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const productIds = searchParams.get('productIds')?.split(',') || []

    if (productIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Product IDs are required' },
        { status: 400 }
      )
    }

    // Remove products from shop
    const deletedCount = await prisma.shopProduct.deleteMany({
      where: {
        shopId: id,
        productId: { in: productIds }
      }
    })

    return NextResponse.json({
      success: true,
      message: `${deletedCount.count} products removed from shop`,
      removedCount: deletedCount.count
    })
  } catch (error) {
    console.error('Error removing products from shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove products from shop' },
      { status: 500 }
    )
  }
}
