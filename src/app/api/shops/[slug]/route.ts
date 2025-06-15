import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ slug: string }>
}

// GET /api/shops/[slug] - Get shop by slug with products
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'name'
    const order = searchParams.get('order') || 'asc'

    const skip = (page - 1) * limit

    // Find the shop
    const shop = await prisma.shop.findUnique({
      where: {
        slug,
        isActive: true
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        featuredImage: true,
        bannerImage: true,
        shopType: true,
        isFeatured: true,
        seoTitle: true,
        seoDescription: true
      }
    })

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Get products in the shop
    let orderBy: Record<string, unknown> = { name: order === 'desc' ? 'desc' : 'asc' }
    
    switch (sort) {
      case 'price':
        orderBy = { price: order === 'desc' ? 'desc' : 'asc' }
        break
      case 'featured':
        orderBy = { isFeatured: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
    }

    const [shopProducts, total] = await Promise.all([
      prisma.shopProduct.findMany({
        where: {
          shopId: shop.id,
          product: {
            isActive: true
          }
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              description: true,
              shortDescription: true,
              price: true,
              comparePrice: true,
              stock: true,
              isFeatured: true,
              images: true,
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              },
              brand: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: {
          product: orderBy
        },
        skip,
        take: limit
      }),
      prisma.shopProduct.count({
        where: {
          shopId: shop.id,
          product: {
            isActive: true
          }
        }
      })
    ])

    const products = shopProducts.map(sp => sp.product)

    return NextResponse.json({
      success: true,
      shop,
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop' },
      { status: 500 }
    )
  }
}
