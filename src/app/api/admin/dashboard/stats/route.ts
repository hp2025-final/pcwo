import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get summary statistics
    const [
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStockProducts
    ] = await Promise.all([
      // Total products
      prisma.product.count({
        where: { isActive: true }
      }),
      
      // Total orders
      prisma.order.count(),
      
      // Total revenue (sum of all completed orders)
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          status: {
            in: ['DELIVERED', 'SHIPPED']
          }
        }
      }),
      
      // Low stock products (below threshold)
      prisma.product.count({
        where: {
          isActive: true,
          stock: {
            lte: prisma.product.fields.lowStockThreshold
          }
        }
      })
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        lowStockProducts
      }
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard stats' 
      },
      { status: 500 }
    )
  }
}
