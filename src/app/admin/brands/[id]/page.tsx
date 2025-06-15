'use client'

import { useState, useEffect, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ImageUpload from '@/components/admin/ImageUpload'

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logoUrl: string | null
  sortOrder: number
  isActive: boolean
  seoTitle: string | null
  seoDescription: string | null
  _count: { products: number }
}

interface BrandFormData {
  name: string
  slug: string
  description: string
  logoUrl: string
  sortOrder: number
  isActive: boolean
  seoTitle: string
  seoDescription: string
}

interface EditBrandPageProps {
  params: Promise<{ id: string }>
}

export default function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [brand, setBrand] = useState<Brand | null>(null)
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    description: '',
    logoUrl: '',
    sortOrder: 0,
    isActive: true,
    seoTitle: '',
    seoDescription: ''  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchBrand = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/brands/${id}`)
      const data = await response.json()
      
      if (data.success && data.brand) {
        const brand = data.brand
        setBrand(brand)
        
        // Populate form data
        setFormData({
          name: brand.name,
          slug: brand.slug,
          description: brand.description || '',
          logoUrl: brand.logoUrl || '',
          sortOrder: brand.sortOrder,
          isActive: brand.isActive,
          seoTitle: brand.seoTitle || '',
          seoDescription: brand.seoDescription || ''
        })
      } else {
        setErrors({ general: 'Brand not found' })
      }
    } catch {
      setErrors({ general: 'Failed to fetch brand' })
    } finally {
      setInitialLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchBrand()
  }, [fetchBrand])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                     type === 'number' ? parseFloat(value) || 0 : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Auto-generate slug when name changes (only if slug wasn't manually modified)
    if (name === 'name' && typeof newValue === 'string') {
      const newSlug = generateSlug(newValue)
      if (formData.slug === generateSlug(formData.name) || !formData.slug) {
        setFormData(prev => ({
          ...prev,
          slug: newSlug
        }))
      }
    }
      // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleLogoChange = (logoPath: string | null) => {
    setFormData(prev => ({
      ...prev,
      logoUrl: logoPath || ''
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)

      const response = await fetch(`/api/admin/brands/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/brands')
      } else {
        setErrors({ general: data.error || 'Failed to update brand' })
      }    } catch {
      setErrors({ general: 'Failed to update brand' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!brand) return

    const hasProducts = brand._count.products > 0
    const message = hasProducts 
      ? 'This brand has products and cannot be deleted. Please move or delete all products first.'
      : 'Are you sure you want to delete this brand? This action cannot be undone.'

    if (hasProducts) {
      alert(message)
      return
    }

    if (!confirm(message)) return

    try {
      setLoading(true)
        const response = await fetch(`/api/admin/brands/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/brands')
      } else {
        setErrors({ general: data.error || 'Failed to delete brand' })
      }    } catch {
      setErrors({ general: 'Failed to delete brand' })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Brand not found</p>
        <Link 
          href="/admin/brands"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Back to Brands
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Brand</h1>
          <p className="text-gray-600">Update brand information</p>
          {brand._count.products > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              This brand has {brand._count.products} products
            </p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDelete}
            disabled={loading || brand._count.products > 0}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition-colors"
            title={brand._count.products > 0 ? 'Cannot delete brand with products' : 'Delete brand'}
          >
            Delete
          </button>
          <Link 
            href="/admin/brands"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Brands
          </Link>
        </div>
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
                Brand Name *
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
                placeholder="Enter brand name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
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
                placeholder="brand-slug"
              />
              {errors.slug && <p className="text-red-600 text-sm mt-1">{errors.slug}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brand description"
              />
            </div>            <div className="md:col-span-2">
              <ImageUpload
                currentImage={formData.logoUrl}
                onImageChange={handleLogoChange}
                directory="brands"
                label="Brand Logo"
                className="mb-4"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-1">
                Sort Order
              </label>
              <input
                type="number"
                id="sortOrder"
                name="sortOrder"
                min="0"
                value={formData.sortOrder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active (Brand will be visible to customers)
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
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
                placeholder="Leave empty to use brand name"
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

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link 
            href="/admin/brands"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {loading ? 'Updating...' : 'Update Brand'}
          </button>
        </div>
      </form>
    </div>
  )
}
