import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const brand = searchParams.get('brand') || ''
    const sortBy = searchParams.get('sortBy') || 'name'
    const order = searchParams.get('order') || 'asc'
    const minPrice = parseFloat(searchParams.get('minPrice') || '0')
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999')
    const inStock = searchParams.get('inStock')

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: Record<string, unknown> = {
      isActive: true // Only show active products to public
    }
    
    // Search functionality
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (category) {
      where.category = {
        slug: category
      }
    }

    // Brand filter
    if (brand) {
      where.brand = {
        slug: brand
      }
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 999999) {
      where.price = {
        gte: minPrice,
        lte: maxPrice
      }
    }

    // Stock filter
    if (inStock === 'true') {
      where.stock = {
        gt: 0
      }
    }

    // Sorting options
    let orderBy: Record<string, unknown> = { name: order === 'desc' ? 'desc' : 'asc' }
    
    switch (sortBy) {
      case 'price':
        orderBy = { price: order === 'desc' ? 'desc' : 'asc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'featured':
        orderBy = { isFeatured: 'desc' }
        break
      case 'popularity':
        // For now, use featured as proxy for popularity
        orderBy = { isFeatured: 'desc' }
        break
    }

    // Get products with pagination
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          shortDescription: true,
          price: true,
          comparePrice: true,
          stock: true,
          isFeatured: true,
          images: true,
          metaTitle: true,
          metaDescription: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          brand: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          createdAt: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ])

    // Parse images for each product
    const processedProducts = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      hasImages: product.images ? JSON.parse(product.images).length > 0 : false,
      inStock: product.stock > 0
    }))

    return NextResponse.json({
      success: true,
      products: processedProducts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      filters: {
        search,
        category,
        brand,
        sortBy,
        order,
        minPrice,
        maxPrice,
        inStock
      }
    })
  } catch (error) {
    console.error('Public products fetch error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch products' 
      },
      { status: 500 }
    )
  }
}
