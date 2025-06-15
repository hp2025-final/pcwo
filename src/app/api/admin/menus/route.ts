import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Validation schema
const menuSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  handle: z.string().min(1, 'Handle is required'),
  description: z.string().optional(),
  location: z.enum(['HEADER', 'FOOTER', 'SIDEBAR', 'MOBILE']).default('HEADER'),
  isActive: z.boolean().default(true)
})

// GET /api/admin/menus - List all menus
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const location = searchParams.get('location') || ''

    const skip = (page - 1) * limit    // Build where clause
    const where: Record<string, unknown> = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { handle: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (location) {
      where.location = location
    }

    // Get menus with items count
    const [menus, total] = await Promise.all([
      prisma.menu.findMany({
        where,
        include: {
          _count: {
            select: { items: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.menu.count({ where })
    ])

    return NextResponse.json({
      success: true,
      menus,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching menus:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menus' },
      { status: 500 }
    )
  }
}

// POST /api/admin/menus - Create new menu
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = menuSchema.parse(body)

    // Check if handle is unique
    const existingMenu = await prisma.menu.findUnique({
      where: { handle: data.handle }
    })

    if (existingMenu) {
      return NextResponse.json(
        { success: false, error: 'Menu handle already exists' },
        { status: 400 }
      )
    }

    const menu = await prisma.menu.create({
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
      message: 'Menu created successfully'
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

    console.error('Error creating menu:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create menu' },
      { status: 500 }
    )
  }
}
