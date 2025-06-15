'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Shop {
  id: string
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  featuredImage: string | null
  shopType: 'MANUAL' | 'AUTOMATIC'
  isFeatured: boolean
  _count: {
    shopProducts: number
  }
}

export default function ShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [featuredShops, setFeaturedShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchShops()
  }, [])

  const fetchShops = async () => {
    try {
      const [shopsResponse, featuredResponse] = await Promise.all([
        fetch('/api/shops'),
        fetch('/api/shops?featured=true')
      ])

      const [shopsData, featuredData] = await Promise.all([
        shopsResponse.json(),
        featuredResponse.json()
      ])

      if (shopsData.success) {
        setShops(shopsData.shops)
      }
      
      if (featuredData.success) {
        setFeaturedShops(featuredData.shops)
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-gray-500">Loading shops...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Collection
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover curated collections of PC components and accessories, 
              handpicked for specific needs and budgets.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Shops */}
        {featuredShops.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Collections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} featured />
              ))}
            </div>
          </div>
        )}

        {/* All Shops */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Collections</h2>
          {shops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {shops.map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500">No shops available at the moment.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ShopCard({ shop, featured = false }: { shop: Shop; featured?: boolean }) {
  return (
    <Link href={`/shop/${shop.slug}`} className="group">
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        featured ? 'ring-2 ring-blue-500' : ''
      }`}>
        {shop.featuredImage ? (
          <div className="relative h-48 bg-gray-200">
            <Image
              src={shop.featuredImage}
              alt={shop.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {featured && (
              <div className="absolute top-2 right-2">
                <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">🛍️</div>
            {featured && (
              <div className="absolute top-2 right-2">
                <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
                  Featured
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {shop.name}
          </h3>
          
          {shop.shortDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {shop.shortDescription}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{shop._count.shopProducts} products</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              shop.shopType === 'MANUAL'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
            }`}>
              {shop.shopType === 'MANUAL' ? 'Curated' : 'Auto-Updated'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
