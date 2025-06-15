import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface MenuItem {
  id: string
  label: string
  url?: string | null
  linkType: string
  linkValue?: string | null
  isActive: boolean
  sortOrder: number
  children?: MenuItem[]
}

interface TransformedMenuItem extends MenuItem {
  resolvedUrl: string
  children: TransformedMenuItem[]
}

// GET /api/menus - Get public menus
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') || ''
    const handle = searchParams.get('handle') || ''

    // Build where clause for active menus only
    const where: Record<string, unknown> = {
      isActive: true
    }

    if (location) {
      where.location = location
    }

    if (handle) {
      where.handle = handle
    }

    const menus = await prisma.menu.findMany({
      where,
      include: {
        items: {
          where: { isActive: true },
          include: {
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' }
            }
          },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    })    // Transform menu items to include resolved URLs
    const transformedMenus = menus.map(menu => ({
      ...menu,
      items: menu.items
        .filter(item => !item.parentId) // Only top-level items
        .map(item => transformMenuItem(item))
    }))

    // If requesting a specific menu by handle, return just that menu
    if (handle) {
      const menu = transformedMenus.find(m => m.handle === handle)
      if (!menu) {
        return NextResponse.json({
          success: false,
          error: 'Menu not found'
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        menu
      })
    }

    return NextResponse.json({
      success: true,
      menus: transformedMenus
    })
  } catch (error) {
    console.error('Error fetching public menus:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menus' },
      { status: 500 }
    )
  }
}

// Helper function to transform menu items and resolve URLs
function transformMenuItem(item: MenuItem): TransformedMenuItem {
  return {
    ...item,
    resolvedUrl: resolveMenuItemUrl(item),
    children: item.children?.map((child: MenuItem) => transformMenuItem(child)) || []
  }
}

// Helper function to resolve menu item URLs based on linkType
function resolveMenuItemUrl(item: MenuItem): string {
  switch (item.linkType) {
    case 'HOME':
      return '/'
    case 'CONTACT':
      return '/contact'
    case 'ABOUT':
      return '/about'
    case 'CATEGORY':
      return item.linkValue ? `/categories/${item.linkValue}` : '#'
    case 'PRODUCT':
      return item.linkValue ? `/products/${item.linkValue}` : '#'
    case 'SHOP':
      return item.linkValue ? `/shop/${item.linkValue}` : '/shops'
    case 'BRAND':
      return item.linkValue ? `/brands/${item.linkValue}` : '#'
    case 'PAGE':
      return item.linkValue ? `/pages/${item.linkValue}` : '#'
    case 'CUSTOM':
    default:
      return item.url || '#'
  }
}
