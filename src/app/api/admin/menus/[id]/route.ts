import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const menuSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  handle: z.string().min(1, 'Handle is required'),
  description: z.string().optional(),
  location: z.enum(['HEADER', 'FOOTER', 'SIDEBAR', 'MOBILE']).default('HEADER'),
  isActive: z.boolean().default(true)
})

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/admin/menus/[id] - Get menu by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            children: {
              orderBy: { sortOrder: 'asc' }
            }
          },
          where: { parentId: null }, // Only top-level items
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: { items: true }
        }
      }
    })

    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      menu
    })
  } catch (error) {
    console.error('Error fetching menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/menus/[id] - Update menu
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = menuSchema.parse(body)

    // Check if menu exists
    const existingMenu = await prisma.menu.findUnique({
      where: { id }
    })

    if (!existingMenu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }

    // Check if handle is unique (excluding current menu)
    if (data.handle !== existingMenu.handle) {
      const duplicateMenu = await prisma.menu.findUnique({
        where: { handle: data.handle }
      })

      if (duplicateMenu) {
        return NextResponse.json(
          { success: false, error: 'Menu handle already exists' },
          { status: 400 }
        )
      }
    }

    const menu = await prisma.menu.update({
      where: { id },
      data,
      include: {
        _count: {
          select: { items: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      menu,
      message: 'Menu updated successfully'
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

    console.error('Error updating menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update menu' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/menus/[id] - Delete menu
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const menu = await prisma.menu.findUnique({
      where: { id },
      include: {
        _count: {
          select: { items: true }
        }
      }
    })

    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }

    // Delete menu (cascade will delete menu items)
    await prisma.menu.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Menu deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete menu' },
      { status: 500 }
    )
  }
}
