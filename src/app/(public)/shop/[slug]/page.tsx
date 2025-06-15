'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Shop {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  featuredImage: string | null
  bannerImage: string | null
  shopType: 'MANUAL' | 'AUTOMATIC'
  isFeatured: boolean
  seoTitle: string | null
  seoDescription: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  price: number
  comparePrice: number | null
  stock: number
  isFeatured: boolean
  images: string | null
  category: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  }
}

interface ShopPageProps {
  params: Promise<{ slug: string }>
}

export default function ShopPage({ params }: ShopPageProps) {
  const [shopSlug, setShopSlug] = useState<string | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const router = useRouter()

  // Resolve async params
  useEffect(() => {
    params.then(({ slug }) => {
      setShopSlug(slug)
    })  }, [params])

  const fetchShop = useCallback(async () => {
    if (!shopSlug) return

    try {
      setLoading(true)
      const response = await fetch(
        `/api/shops/${shopSlug}?page=${currentPage}&sort=${sortBy}&order=${sortOrder}`
      )
      const data = await response.json()

      if (data.success) {
        setShop(data.shop)
        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
      } else {
        router.push('/404')
      }
    } catch (error) {
      console.error('Failed to fetch shop:', error)
      router.push('/404')
    } finally {
      setLoading(false)
    }  }, [shopSlug, currentPage, sortBy, sortOrder, router])

  // Effect to trigger shop fetching when dependencies change
  useEffect(() => {
    if (shopSlug) {
      fetchShop()
    }
  }, [shopSlug, currentPage, sortBy, sortOrder, fetchShop])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500">Loading shop...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!shop) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        {shop.bannerImage ? (
          <div className="relative h-64 bg-gray-200">
            <Image
              src={shop.bannerImage}
              alt={shop.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-2">{shop.name}</h1>
                {shop.shortDescription && (
                  <p className="text-xl opacity-90">{shop.shortDescription}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{shop.name}</h1>
              {shop.shortDescription && (
                <p className="text-xl text-gray-600">{shop.shortDescription}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <Link href="/shops" className="text-gray-500 hover:text-gray-700">
                Shops
              </Link>
            </li>
            <li>
              <span className="text-gray-400">/</span>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{shop.name}</span>
            </li>
          </ol>
        </nav>

        {/* Shop Description */}
        {shop.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <p className="text-gray-700 leading-relaxed">{shop.description}</p>
          </div>
        )}

        {/* Filters and Sorting */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 font-medium">
                {products.length} Products
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                shop.shopType === 'MANUAL'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {shop.shopType === 'MANUAL' ? 'Curated Collection' : 'Auto-Updated'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm text-gray-700">Sort by:</label>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sort, order] = e.target.value.split('-')
                  setSortBy(sort)
                  setSortOrder(order)
                  setCurrentPage(1)
                }}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="newest-desc">Newest First</option>
                <option value="featured-desc">Featured First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-500 mb-4">
              <div className="text-4xl mb-2">📦</div>
              <p>No products found in this shop.</p>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-md ${
                  page === currentPage
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const productImage = product.images ? (() => {
    try {
      const images = JSON.parse(product.images)
      return Array.isArray(images) && images.length > 0 ? images[0] : null
    } catch {
      return null
    }
  })() : null

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {productImage ? (
          <div className="relative h-48 bg-gray-200">
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isFeatured && (
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">📦</div>
            {product.isFeatured && (
              <div className="absolute top-2 left-2">
                <span className="bg-yellow-500 text-white px-2 py-1 text-xs rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          <div className="text-sm text-gray-500 mb-2">
            {product.brand.name} • {product.category.name}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-green-600">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  Rs. {product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {product.stock > 0 ? (
                <span className="text-green-600">In Stock</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
