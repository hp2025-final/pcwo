import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' }
    })

    return NextResponse.json({
      success: true,
      settings
    })
  } catch (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch settings' 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { settings } = body

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid settings data' 
        },
        { status: 400 }
      )
    }

    // Update settings using upsert
    const updatePromises = Object.entries(settings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { 
          key, 
          value: String(value),
          description: null
        }
      })
    )

    await Promise.all(updatePromises)

    // Fetch updated settings
    const updatedSettings = await prisma.siteSetting.findMany({
      orderBy: { key: 'asc' }
    })

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
      message: 'Settings updated successfully'
    })
  } catch (error) {
    console.error('Settings update error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update settings' 
      },
      { status: 500 }
    )
  }
}
