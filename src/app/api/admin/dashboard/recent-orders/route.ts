import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get recent orders (last 10)
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        customerPhone: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      success: true,
      orders: recentOrders
    })
  } catch (error) {
    console.error('Recent orders error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch recent orders' 
      },
      { status: 500 }
    )
  }
}
