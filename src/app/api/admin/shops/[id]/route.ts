import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/shops/[id] - Get single shop
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        shopProducts: {
          include: {
            product: {
              include: {
                category: true,
                brand: true
              }
            }
          },
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: {
            shopProducts: true
          }
        }
      }
    })

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      shop
    })
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shop' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/shops/[id] - Update shop
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const body = await request.json()

    const shopSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      slug: z.string().min(1, 'Slug is required'),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      featuredImage: z.string().optional(),
      bannerImage: z.string().optional(),
      shopType: z.enum(['MANUAL', 'AUTOMATIC']),
      rules: z.string().optional(),
      isActive: z.boolean(),
      isFeatured: z.boolean(),
      sortOrder: z.number(),
      seoTitle: z.string().optional(),
      seoDescription: z.string().optional()
    })

    const validatedData = shopSchema.parse(body)

    // Check if slug already exists (excluding current shop)
    const existingShop = await prisma.shop.findFirst({
      where: {
        slug: validatedData.slug,
        NOT: { id }
      }
    })

    if (existingShop) {
      return NextResponse.json(
        { success: false, error: 'Shop with this slug already exists' },
        { status: 400 }
      )
    }

    const shop = await prisma.shop.update({
      where: { id },
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

    console.error('Error updating shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update shop' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/shops/[id] - Delete shop
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params

    // Check if shop exists
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            shopProducts: true
          }
        }
      }
    })

    if (!shop) {
      return NextResponse.json(
        { success: false, error: 'Shop not found' },
        { status: 404 }
      )
    }

    // Delete the shop (cascade will handle shop products)
    await prisma.shop.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Shop deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete shop' },
      { status: 500 }
    )
  }
}
