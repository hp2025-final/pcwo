import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// GET /api/admin/shops - List all shops
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const shopType = searchParams.get('shopType') || ''
    const isActive = searchParams.get('isActive')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (shopType) {
      where.shopType = shopType
    }
    
    if (isActive !== null && isActive !== '') {
      where.isActive = isActive === 'true'
    }

    const [shops, total] = await Promise.all([
      prisma.shop.findMany({
        where,
        include: {
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
        skip,
        take: limit
      }),
      prisma.shop.count({ where })
    ])

    return NextResponse.json({
      success: true,
      shops,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
}

// POST /api/admin/shops - Create new shop
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const shopSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      slug: z.string().min(1, 'Slug is required'),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      featuredImage: z.string().optional(),
      bannerImage: z.string().optional(),
      shopType: z.enum(['MANUAL', 'AUTOMATIC']).default('MANUAL'),
      rules: z.string().optional(), // JSON string for automatic rules
      isActive: z.boolean().default(true),
      isFeatured: z.boolean().default(false),
      sortOrder: z.number().default(0),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional()
    })

    const validatedData = shopSchema.parse(body)

    // Check if slug already exists
    const existingShop = await prisma.shop.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingShop) {
      return NextResponse.json(
        { success: false, error: 'Shop with this slug already exists' },
        { status: 400 }
      )
    }

    const shop = await prisma.shop.create({
      data: validatedData,
      include: {
        _count: {
          select: {
            shopProducts: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      shop
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create shop' },
      { status: 500 }
    )
  }
}
