import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const menuItemSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  url: z.string().optional(),
  linkType: z.enum(['CUSTOM', 'PAGE', 'CATEGORY', 'PRODUCT', 'SHOP', 'BRAND', 'HOME', 'CONTACT', 'ABOUT']).default('CUSTOM'),
  linkValue: z.string().optional(),
  target: z.string().default('_self'),
  cssClass: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().default(0),
  parentId: z.string().optional()
})

interface RouteParams {
  params: Promise<{ id: string; itemId: string }>
}

// GET /api/admin/menus/[id]/items/[itemId] - Get menu item
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { itemId } = await params

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' }
        },
        parent: true
      }
    })

    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      item: menuItem
    })
  } catch (error) {
    console.error('Error fetching menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu item' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/menus/[id]/items/[itemId] - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: menuId, itemId } = await params
    const body = await request.json()
    const data = menuItemSchema.parse(body)

    // Check if menu item exists
    const existingItem = await prisma.menuItem.findUnique({
      where: { id: itemId }
    })

    if (!existingItem || existingItem.menuId !== menuId) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }

    // Verify parent item exists if provided
    if (data.parentId && data.parentId !== existingItem.id) {
      const parentItem = await prisma.menuItem.findUnique({
        where: { id: data.parentId }
      })

      if (!parentItem || parentItem.menuId !== menuId) {
        return NextResponse.json(
          { success: false, error: 'Invalid parent menu item' },
          { status: 400 }
        )
      }

      // Prevent circular references
      if (data.parentId === itemId) {
        return NextResponse.json(
          { success: false, error: 'Menu item cannot be its own parent' },
          { status: 400 }
        )
      }
    }

    const menuItem = await prisma.menuItem.update({
      where: { id: itemId },
      data,
      include: {
        children: {
          orderBy: { sortOrder: 'asc' }
        },
        parent: true
      }
    })

    return NextResponse.json({
      success: true,
      item: menuItem,
      message: 'Menu item updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    console.error('Error updating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update menu item' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/menus/[id]/items/[itemId] - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: menuId, itemId } = await params

    const menuItem = await prisma.menuItem.findUnique({
      where: { id: itemId },
      include: {
        children: true
      }
    })

    if (!menuItem || menuItem.menuId !== menuId) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found' },
        { status: 404 }
      )
    }

    // Delete menu item (cascade will handle children)
    await prisma.menuItem.delete({
      where: { id: itemId }
    })

    return NextResponse.json({
      success: true,
      message: 'Menu item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu item' },
      { status: 500 }
    )
  }
}
