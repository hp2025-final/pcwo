'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Shop {
  id: string
  name: string
  slug: string
  description: string | null
  shopType: 'MANUAL' | 'AUTOMATIC'
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  _count: {
    shopProducts: number
  }
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedShops, setSelectedShops] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [shopTypeFilter, setShopTypeFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const fetchShops = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      if (shopTypeFilter) params.set('shopType', shopTypeFilter)
      if (activeFilter) params.set('isActive', activeFilter)

      const response = await fetch(`/api/admin/shops?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setShops(data.shops)
      }
    } catch (error) {
      console.error('Failed to fetch shops:', error)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, shopTypeFilter, activeFilter])

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  const handleSelectShop = (shopId: string, checked: boolean) => {
    if (checked) {
      setSelectedShops([...selectedShops, shopId])
    } else {
      setSelectedShops(selectedShops.filter(id => id !== shopId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShops(shops.map(shop => shop.id))
    } else {
      setSelectedShops([])
    }
  }

  const handleBulkDelete = async () => {
    if (selectedShops.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${selectedShops.length} shop(s)?`)) {
      return
    }

    try {
      const deletePromises = selectedShops.map(shopId =>
        fetch(`/api/admin/shops/${shopId}`, { method: 'DELETE' })
      )
      
      await Promise.all(deletePromises)
      setSelectedShops([])
      fetchShops()
    } catch (error) {
      console.error('Failed to delete shops:', error)
      alert('Failed to delete some shops')
    }
  }

  const handleDeleteShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to delete this shop?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/shops/${shopId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchShops()
      } else {
        alert('Failed to delete shop')
      }
    } catch (error) {
      console.error('Failed to delete shop:', error)
      alert('Failed to delete shop')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shops</h1>
          <p className="text-gray-600">Manage your product collections</p>
        </div>
        <Link 
          href="/admin/shops/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Add New Shop
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search shops..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Type
            </label>
            <select
              value={shopTypeFilter}
              onChange={(e) => setShopTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('')
                setShopTypeFilter('')
                setActiveFilter('')
              }}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedShops.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-700">
              {selectedShops.length} shop(s) selected
            </span>
            <div className="space-x-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shops Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-500">Loading shops...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedShops.length === shops.length && shops.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedShops.includes(shop.id)}
                        onChange={(e) => handleSelectShop(shop.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {shop.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          /{shop.slug}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        shop.shopType === 'MANUAL' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {shop.shopType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shop._count.shopProducts} products
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        shop.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {shop.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {shop.isFeatured && (
                        <span className="ml-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Link
                        href={`/admin/shops/${shop.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/shop/${shop.slug}`}
                        target="_blank"
                        className="text-green-600 hover:text-green-900"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteShop(shop.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {shops.length === 0 && !loading && (
              <div className="p-8 text-center">
                <div className="text-gray-500">No shops found</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
