import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { categorySchema, type CategoryInput } from '@/lib/validators'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parentCategory: { select: { id: true, name: true } },
        _count: { select: { products: true } }
      }
    })

    if (!category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found' 
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      category
    })
  } catch (error) {
    console.error('Category fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch category' 
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
        { status: 400 }      )
    }    const data: CategoryInput = validationResult.data

    // Transform parentCategoryId to parentId for database and prepare update data
    const updateData: Record<string, unknown> = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      image: data.image,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      specificationTemplate: data.specificationTemplate,
      parentId: data.parentCategoryId || null
    }    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    })

    if (!existingCategory) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found' 
        },
        { status: 404 }
      )
    }    // Check for slug uniqueness (excluding current category)
    const slugExists = await prisma.category.findFirst({
      where: { 
        slug: data.slug as string,
        id: { not: id }
      }
    })

    if (slugExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Slug already exists' 
        },        { status: 400 }
      )
    }    // Prevent setting self as parent
    if (updateData.parentId === id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot set category as its own parent' 
        },
        { status: 400 }
      )
    }    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        parentCategory: { select: { id: true, name: true } }
      }
    })

    return NextResponse.json({
      success: true,
      category: updatedCategory
    })  } catch (error: unknown) {
    console.error('Category update error:', error)
    
    // Handle specific database errors
    let errorMessage = 'Failed to update category'
    let statusCode = 500
    
    const prismaError = error as { code?: string; meta?: { target?: string[] }; message?: string }
    if (prismaError.code === 'P2002') {
      // Unique constraint violation
      const target = prismaError.meta?.target || []
      if (target.includes('name')) {
        errorMessage = 'A category with this name already exists'
      } else if (target.includes('slug')) {
        errorMessage = 'A category with this slug already exists'
      } else {
        errorMessage = 'A category with these details already exists'
      }
      statusCode = 409    } else if (prismaError.code === 'P2003') {
      // Foreign key constraint violation
      errorMessage = 'Invalid parent category selected'
      statusCode = 400
    } else if (prismaError.code === 'P2025') {
      // Record not found
      errorMessage = 'Category not found'
      statusCode = 404
    } else if (prismaError.message?.includes('JSON')) {
      errorMessage = 'Invalid specification template format'
      statusCode = 400
    } else if (prismaError.message) {
      errorMessage = `Database error: ${prismaError.message}`
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        code: prismaError.code || 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? prismaError.message : undefined
      },
      { status: statusCode }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: { select: { id: true } },
        subcategories: { select: { id: true } }
      }
    })

    if (!category) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Category not found' 
        },
        { status: 404 }
      )
    }

    // Check if category has products
    if (category.products.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete category with products' 
        },
        { status: 400 }
      )
    }

    // Check if category has children
    if (category.subcategories.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Cannot delete category with subcategories' 
        },
        { status: 400 }
      )
    }    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Category delete error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete category' 
      },
      { status: 500 }
    )
  }
}
