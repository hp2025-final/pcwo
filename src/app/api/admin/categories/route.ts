import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validators'

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        },
        parentCategory: {
          select: { name: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      categories
    })
  } catch (error) {
    console.error('Categories fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
      // Validate input
    const validationResult = categorySchema.safeParse(body)
    if (!validationResult.success) {
      const validationErrors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code
      }))
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed. Please check the form fields.',
          type: 'VALIDATION_ERROR',
          details: validationErrors
        },
        { status: 400 }
      )
    }const categoryData = validationResult.data

    // Transform parentCategoryId to parentId for database
    const { parentCategoryId, ...rest } = categoryData
    const dbData = {
      ...rest,
      parentId: parentCategoryId
    }

    // Create category
    const category = await prisma.category.create({
      data: dbData,
      include: {
        parentCategory: {
          select: { name: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      category
    }, { status: 201 })
  } catch (error) {    console.error('Category creation error:', error)
    
    // Handle specific database errors
    let errorMessage = 'Failed to create category'
    let statusCode = 500
    
    const dbError = error as { code?: string; meta?: { target?: string[] }; message?: string }
      if (dbError.code === 'P2002') {
      // Unique constraint violation
      const target = dbError.meta?.target || []
      if (target.includes('name')) {
        errorMessage = 'A category with this name already exists'
      } else if (target.includes('slug')) {
        errorMessage = 'A category with this slug already exists'
      } else {
        errorMessage = 'A category with these details already exists'
      }      statusCode = 409
    } else if (dbError.code === 'P2003') {
      // Foreign key constraint violation
      errorMessage = 'Invalid parent category selected'
      statusCode = 400
    } else if (dbError.code === 'P2025') {
      // Record not found
      errorMessage = 'Parent category not found'
      statusCode = 404
    } else if (dbError.message?.includes('JSON')) {
      errorMessage = 'Invalid specification template format'
      statusCode = 400
    } else if (dbError.message) {
      errorMessage = `Database error: ${dbError.message}`
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        code: dbError.code || 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      },
      { status: statusCode }
    )
  }
}
