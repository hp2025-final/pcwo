'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import SpecificationTemplateManager from '@/components/admin/SpecificationTemplateManager'
import { SpecificationField } from '@/lib/specification-templates'

interface Category {
  id: string
  name: string
  parentCategoryId: string | null
  parentCategory?: { name: string }
}

interface ValidationError {
  field: string
  message: string
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  parentCategoryId: string
  sortOrder: number
  isActive: boolean
  seoTitle: string
  seoDescription: string
  specificationTemplate: SpecificationField[]
}

export default function NewCategoryPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parentCategoryId: '',
    sortOrder: 0,
    isActive: true,
    seoTitle: '',
    seoDescription: '',
    specificationTemplate: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                     type === 'number' ? parseFloat(value) || 0 : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Auto-generate slug when name changes
    if (name === 'name' && typeof newValue === 'string') {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(newValue)
      }))
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
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
      
      const submitData = {
        ...formData,
        parentCategoryId: formData.parentCategoryId || null,
        specificationTemplate: JSON.stringify(formData.specificationTemplate)
      }

      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/categories')
      } else {        // Handle different types of errors
        if (data.type === 'VALIDATION_ERROR' && data.details && Array.isArray(data.details)) {
          // Handle validation errors
          const validationErrors: Record<string, string> = {}
          data.details.forEach((error: ValidationError) => {
            if (error.field) {
              validationErrors[error.field] = error.message
            }
          })
          setErrors(validationErrors)
          
          // Also show a general message for validation errors
          if (Object.keys(validationErrors).length > 0) {
            setErrors(prev => ({
              ...prev,
              general: 'Please fix the validation errors below'
            }))
          }
        } else {
          // Handle other types of errors with clearer messages
          let errorMessage = data.error || 'Failed to create category'
          
          // Add helpful context based on error type
          if (data.code === 'P2002') {
            errorMessage += '. Please try a different name or slug.'
          } else if (data.code === 'P2003') {
            errorMessage += '. Please select a valid parent category.'
          } else if (!response.ok) {
            errorMessage += ` (Error ${response.status})`
          }
          
          setErrors({ general: errorMessage })
        }
      }    } catch (error: unknown) {
      console.error('Category creation error:', error)
      let errorMessage = 'Failed to create category'
      
      if (error instanceof Error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        } else if (error.name === 'SyntaxError') {
          errorMessage = 'Server response error. Please try again.'
        } else {
          errorMessage = error.message || 'An unexpected error occurred. Please try again.'
        }
      } else {
        errorMessage = 'An unexpected error occurred. Please try again.'
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
          <p className="text-gray-600">Create a new product category</p>
        </div>
        <Link 
          href="/admin/categories"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Categories
        </Link>
      </div>      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error Creating Category
              </h3>
              <div className="mt-1 text-sm text-red-700">
                {errors.general}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name *
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
                placeholder="Enter category name"
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
                placeholder="category-slug"
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
                placeholder="Enter category description"
              />
            </div>
          </div>
        </div>

        {/* Hierarchy & Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Hierarchy & Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">            <div>
              <label htmlFor="parentCategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Parent Category
              </label>
              <select
                id="parentCategoryId"
                name="parentCategoryId"
                value={formData.parentCategoryId}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None (Top Level)</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parentCategory ? `${category.parentCategory.name} > ` : ''}{category.name}
                  </option>
                ))}
              </select>
            </div>

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
          </div>

          <div className="mt-4">
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
                Active (Category will be visible to customers)
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
                placeholder="Leave empty to use category name"
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
          </div>        </div>

        {/* Specification Template */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Specification Template</h2>
          <p className="text-sm text-gray-600 mb-6">
            Define the specification fields that will be available when creating products in this category. 
            These fields will automatically appear in the product form when this category is selected.
          </p>
          <SpecificationTemplateManager
            fields={formData.specificationTemplate}
            onChange={(fields) => setFormData(prev => ({ ...prev, specificationTemplate: fields }))}
            errors={errors}
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link 
            href="/admin/categories"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </div>
      </form>
    </div>
  )
}
