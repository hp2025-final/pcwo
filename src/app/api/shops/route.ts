import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/shops - Get all active shops for public display
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '0')

    const where: Record<string, unknown> = {
      isActive: true
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const shops = await prisma.shop.findMany({
      where,
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
        sortOrder: true,
        seoTitle: true,
        seoDescription: true,
        _count: {
          select: {
            shopProducts: true
          }
        }
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' }
      ],
      take: limit > 0 ? limit : undefined
    })

    return NextResponse.json({
      success: true,
      shops
    })
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
}
