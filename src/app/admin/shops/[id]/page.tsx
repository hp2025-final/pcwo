'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ShopFormData {
  name: string
  slug: string
  description: string
  shortDescription: string
  featuredImage: string
  bannerImage: string
  shopType: 'MANUAL' | 'AUTOMATIC'
  rules: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  seoTitle: string
  seoDescription: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  isActive: boolean
  category: {
    name: string
  }
  brand: {
    name: string
  }
}

interface EditShopPageProps {
  params: Promise<{ id: string }>
}

export default function EditShopPage({ params }: EditShopPageProps) {
  const [shopId, setShopId] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    featuredImage: '',
    bannerImage: '',
    shopType: 'MANUAL',
    rules: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    seoTitle: '',
    seoDescription: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shopProducts, setShopProducts] = useState<Product[]>([])
  const [availableProducts, setAvailableProducts] = useState<Product[]>([])
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  // Resolve async params
  useEffect(() => {
    params.then(({ id }) => {
      setShopId(id)
    })
  }, [params])

  const fetchShop = useCallback(async () => {
    if (!shopId) return

    try {
      const response = await fetch(`/api/admin/shops/${shopId}`)
      const data = await response.json()

      if (data.success && data.shop) {
        const shop = data.shop
        setFormData({
          name: shop.name,
          slug: shop.slug,
          description: shop.description || '',
          shortDescription: shop.shortDescription || '',
          featuredImage: shop.featuredImage || '',
          bannerImage: shop.bannerImage || '',
          shopType: shop.shopType,
          rules: shop.rules || '',
          isActive: shop.isActive,
          isFeatured: shop.isFeatured,
          sortOrder: shop.sortOrder,
          seoTitle: shop.seoTitle || '',
          seoDescription: shop.seoDescription || ''
        })        // Set shop products
        if (shop.shopProducts) {
          setShopProducts(shop.shopProducts.map((sp: { product: Product }) => sp.product))
        }
      } else {
        setErrors({ general: 'Shop not found' })
      }    } catch {
      setErrors({ general: 'Failed to fetch shop' })    } finally {
      setInitialLoading(false)
    }
  }, [shopId])

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch('/api/admin/products?limit=100')
      const data = await response.json()
      if (data.success) {
        // Filter out products already in shop
        const currentProductIds = shopProducts.map(p => p.id)
        const available = data.products.filter((p: Product) => !currentProductIds.includes(p.id))
        setAvailableProducts(available)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }  }

  // Effect to trigger data fetching when shopId changes
  useEffect(() => {
    if (shopId) {
      fetchShop()
    }
  }, [shopId, fetchShop])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) || 0 : value
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (formData.shopType === 'AUTOMATIC' && !formData.rules.trim()) {
      newErrors.rules = 'Rules are required for automatic shops'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/shops/${shopId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/shops')
      } else {
        if (data.details && Array.isArray(data.details)) {
          const validationErrors: Record<string, string> = {}
          data.details.forEach((error: { path?: string[]; message: string }) => {
            if (error.path && error.path.length > 0) {
              validationErrors[error.path[0]] = error.message
            }
          })
          setErrors(validationErrors)
        } else {
          setErrors({ general: data.error || 'Failed to update shop' })
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ general: 'Failed to update shop' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProducts = async () => {
    if (selectedProducts.length === 0) return

    try {
      const response = await fetch(`/api/admin/shops/${shopId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productIds: selectedProducts }),
      })

      const data = await response.json()

      if (data.success) {
        setSelectedProducts([])
        setShowProductSelector(false)
        fetchShop() // Refresh shop data
      } else {
        alert(data.error || 'Failed to add products')
      }
    } catch (error) {
      console.error('Failed to add products:', error)
      alert('Failed to add products')
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    if (!confirm('Remove this product from the shop?')) return

    try {
      const response = await fetch(`/api/admin/shops/${shopId}/products?productIds=${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        fetchShop() // Refresh shop data
      } else {
        alert('Failed to remove product')
      }
    } catch (error) {
      console.error('Failed to remove product:', error)
      alert('Failed to remove product')
    }
  }

  const handleShowProductSelector = () => {
    fetchAvailableProducts()
    setShowProductSelector(true)
  }

  if (initialLoading) {
    return <div className="p-8 text-center">Loading shop...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Shop</h1>
          <p className="text-gray-600">Update shop information and manage products</p>
        </div>
        <Link 
          href="/admin/shops"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Shops
        </Link>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information - Same as new shop form */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter shop name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.slug ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="shop-url-slug"
              />
              {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
              <p className="text-xs text-gray-500 mt-1">URL: /shop/{formData.slug}</p>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description for listings"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed shop description"
              />
            </div>
          </div>
        </div>

        {/* Shop Products Management */}
        {formData.shopType === 'MANUAL' && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Products ({shopProducts.length})</h2>
              <button
                type="button"
                onClick={handleShowProductSelector}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Add Products
              </button>
            </div>

            {shopProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.category.name} • {product.brand.name}</p>
                    <p className="text-sm font-medium text-green-600">Rs. {product.price}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(product.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No products in this shop yet.</p>
                <button
                  type="button"
                  onClick={handleShowProductSelector}
                  className="mt-2 text-blue-600 hover:text-blue-800"
                >
                  Add some products
                </button>
              </div>
            )}
          </div>
        )}

        {/* Product Selector Modal */}
        {showProductSelector && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Add Products to Shop</h3>
                <button
                  type="button"
                  onClick={() => setShowProductSelector(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {availableProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-500">{product.category.name} • {product.brand.name}</p>
                        <p className="text-sm font-medium text-green-600">Rs. {product.price}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts([...selectedProducts, product.id])
                          } else {
                            setSelectedProducts(selectedProducts.filter(id => id !== product.id))
                          }
                        }}
                        className="ml-2"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowProductSelector(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProducts}
                  disabled={selectedProducts.length === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Add {selectedProducts.length} Products
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the form (Shop Type, Images, SEO, Settings) - Same as new shop form */}
        {/* ... [Include same sections as new shop form] ... */}

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link 
            href="/admin/shops"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {loading ? 'Updating...' : 'Update Shop'}
          </button>
        </div>
      </form>
    </div>
  )
}
