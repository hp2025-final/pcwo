import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { brandSchema } from '@/lib/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } }
      }
    })

    if (!brand) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      brand
    })
  } catch (error) {
    console.error('Brand fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch brand' 
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
    const validationResult = brandSchema.safeParse(body)
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

    const data = validationResult.data    // Check if brand exists
    const existingBrand = await prisma.brand.findUnique({
      where: { id }
    })

    if (!existingBrand) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand not found' 
        },
        { status: 404 }
      )
    }

    // Check for slug uniqueness (excluding current brand)
    const slugExists = await prisma.brand.findFirst({
      where: { 
        slug: data.slug,
        id: { not: id }
      }
    })

    if (slugExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug already exists' 
        },
        { status: 400 }
      )
    }    // Update brand
    const updatedBrand = await prisma.brand.update({
      where: { id },data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        logo: data.logo,
        website: data.website,
        isActive: data.isActive,
        updatedAt: new Date()
      },
      include: {
        _count: { select: { products: true } }
      }
    })

    return NextResponse.json({
      success: true,
      brand: updatedBrand
    })
  } catch (error) {
    console.error('Brand update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update brand' 
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
    // Check if brand exists
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } }
      }
    })

    if (!brand) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Brand not found' 
        },
        { status: 404 }
      )
    }

    // Check if brand has products
    if (brand._count.products > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete brand with products' 
        },
        { status: 400 }
      )
    }    // Delete brand
    await prisma.brand.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Brand deleted successfully'
    })
  } catch (error) {
    console.error('Brand delete error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete brand' 
      },
      { status: 500 }
    )
  }
}
