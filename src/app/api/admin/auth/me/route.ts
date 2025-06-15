import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenServer } from '@/lib/auth-server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not authenticated' 
        },
        { status: 401 }
      )
    }

    // Verify token
    const payload = verifyTokenServer(token)
    if (!payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid token' 
        },
        { status: 401 }
      )
    }

    // Get current user details
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found or inactive' 
        },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: adminUser
    })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
