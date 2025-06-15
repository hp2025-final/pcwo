import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')

    // Build where clause based on category filter
    const where: Record<string, unknown> = {
      isActive: true
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug
      }
    }

    // Get available filter options based on active products
    const [categories, brands, priceRange] = await Promise.all([
      // Get categories that have active products
      prisma.category.findMany({
        where: {
          products: {
            some: {
              isActive: true
            }
          }
        },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              products: {
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: { name: 'asc' }
      }),

      // Get brands that have active products
      prisma.brand.findMany({
        where: {
          products: {
            some: where
          }
        },
        select: {
          id: true,
          name: true,
          slug: true,
          _count: {
            select: {
              products: {
                where
              }
            }
          }
        },
        orderBy: { name: 'asc' }
      }),

      // Get price range
      prisma.product.aggregate({
        where,
        _min: { price: true },
        _max: { price: true }
      })
    ])

    // Get stock status counts
    const stockCounts = await prisma.product.groupBy({
      by: ['stock'],
      where,
      _count: true
    })

    const inStockCount = stockCounts.reduce((total, item) => {
      return item.stock > 0 ? total + item._count : total
    }, 0)

    const outOfStockCount = stockCounts.reduce((total, item) => {
      return item.stock === 0 ? total + item._count : total
    }, 0)

    return NextResponse.json({
      success: true,
      filters: {
        categories: categories.map(cat => ({
          ...cat,
          productCount: cat._count.products
        })),
        brands: brands.map(brand => ({
          ...brand,
          productCount: brand._count.products
        })),
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 100000
        },
        stockStatus: {
          inStock: inStockCount,
          outOfStock: outOfStockCount
        }
      }
    })
  } catch (error) {
    console.error('Filters fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch filters' 
      },
      { status: 500 }
    )
  }
}
