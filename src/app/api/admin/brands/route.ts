import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { brandSchema } from '@/lib/validators'

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      brands
    })
  } catch (error) {
    console.error('Brands fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch brands' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const brandData = validationResult.data

    // Create brand
    const brand = await prisma.brand.create({
      data: brandData
    })

    return NextResponse.json({
      success: true,
      message: 'Brand created successfully',
      brand
    }, { status: 201 })
  } catch (error) {
    console.error('Brand creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create brand' 
      },
      { status: 500 }
    )
  }
}
