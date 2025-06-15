'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'

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

export default function NewShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name && !formData.slug) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }, [formData.name, formData.slug])

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
    }
  }

  const handleImageChange = (field: 'featuredImage' | 'bannerImage') => (imagePath: string | null) => {
    if (imagePath) {
      setFormData(prev => ({ ...prev, [field]: imagePath }))
    }
  }

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
      
      const response = await fetch('/api/admin/shops', {
        method: 'POST',
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
          setErrors({ general: data.error || 'Failed to create shop' })
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ general: 'Failed to create shop' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Shop</h1>
          <p className="text-gray-600">Create a new product collection</p>
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
        {/* Basic Information */}
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

        {/* Shop Type & Rules */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shop Configuration</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="shopType" className="block text-sm font-medium text-gray-700 mb-1">
                Shop Type *
              </label>
              <select
                id="shopType"
                name="shopType"
                value={formData.shopType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="MANUAL">Manual - Manually select products</option>
                <option value="AUTOMATIC">Automatic - Auto-add products based on rules</option>
              </select>
            </div>

            {formData.shopType === 'AUTOMATIC' && (
              <div>
                <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-1">
                  Automatic Rules *
                </label>
                <textarea
                  id="rules"
                  name="rules"
                  rows={4}
                  value={formData.rules}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rules ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='{"categories": ["processors", "graphics-cards"], "maxPrice": 50000}'
                />
                {errors.rules && <p className="text-red-600 text-sm mt-1">{errors.rules}</p>}
                <p className="text-xs text-gray-500 mt-1">
                  JSON rules for automatically adding products (categories, brands, tags, price ranges, etc.)
                </p>
              </div>
            )}

            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Featured Image</h3>
              <p className="text-xs text-gray-500 mb-3">Used in shop listings and cards</p>
              <ImageUpload
                onImageChange={handleImageChange('featuredImage')}
                directory="shops"
                label="Upload Featured Image"
              />              {formData.featuredImage && (
                <div className="mt-3">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured"
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Banner Image</h3>
              <p className="text-xs text-gray-500 mb-3">Used as hero image on shop page</p>
              <ImageUpload
                onImageChange={handleImageChange('bannerImage')}
                directory="shops"
                label="Upload Banner Image"
              />              {formData.bannerImage && (
                <div className="mt-3">
                  <Image
                    src={formData.bannerImage}
                    alt="Banner"
                    width={400}
                    height={80}
                    className="w-full h-20 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                value={formData.seoTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty to use shop name"
              />
            </div>

            <div>
              <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={3}
                value={formData.seoDescription}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter meta description for search engines"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (Shop will be visible to customers)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                Featured (Shop will appear in featured sections)
              </label>
            </div>
          </div>
        </div>

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
            {loading ? 'Creating...' : 'Create Shop'}
          </button>
        </div>
      </form>
    </div>
  )
}
