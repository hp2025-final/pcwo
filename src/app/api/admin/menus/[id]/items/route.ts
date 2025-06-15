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
  params: Promise<{ id: string }>
}

// GET /api/admin/menus/[id]/items - Get menu items
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    const menuItems = await prisma.menuItem.findMany({
      where: { menuId: id },
      include: {
        children: {
          orderBy: { sortOrder: 'asc' }
        }
      },      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: menuItems
    })
  } catch (error) {
    console.error('Error fetching menu items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

// POST /api/admin/menus/[id]/items - Create menu item
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id: menuId } = await params
    const body = await request.json()
    const data = menuItemSchema.parse(body)

    // Verify menu exists
    const menu = await prisma.menu.findUnique({
      where: { id: menuId }
    })

    if (!menu) {
      return NextResponse.json(
        { success: false, error: 'Menu not found' },
        { status: 404 }
      )
    }

    // Verify parent item exists if provided
    if (data.parentId) {
      const parentItem = await prisma.menuItem.findUnique({
        where: { id: data.parentId }
      })

      if (!parentItem || parentItem.menuId !== menuId) {
        return NextResponse.json(
          { success: false, error: 'Invalid parent menu item' },
          { status: 400 }
        )
      }
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        ...data,
        menuId
      },
      include: {
        children: true
      }
    })

    return NextResponse.json({
      success: true,
      item: menuItem,
      message: 'Menu item created successfully'
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

    console.error('Error creating menu item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create menu item' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/menus/[id]/items - Bulk update menu items (for reordering)
export async function PUT(request: NextRequest) {try {
    const { items } = await request.json()

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'Items must be an array' },
        { status: 400 }
      )
    }

    // Update sort orders in a transaction
    await prisma.$transaction(
      items.map((item: { id: string; parentId?: string | null }, index: number) =>
        prisma.menuItem.update({
          where: { id: item.id },
          data: { 
            sortOrder: index,
            parentId: item.parentId || null
          }
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: 'Menu items reordered successfully'
    })
  } catch (error) {
    console.error('Error reordering menu items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to reorder menu items' },
      { status: 500 }
    )
  }
}
