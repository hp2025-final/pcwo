'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'
import DynamicSpecifications from '@/components/admin/DynamicSpecifications'
import { CategorySpecTemplate } from '@/lib/specification-templates'

interface Category {
  id: string
  name: string
  parentCategoryId: string | null
  parentCategory?: { name: string }
}

interface Brand {
  id: string
  name: string
}

interface ProductFormData {
  name: string
  description: string
  sku: string
  price: number
  costPrice: number
  stock: number
  minStock: number
  maxStock: number
  categoryId: string
  brandId: string
  isActive: boolean
  isFeatured: boolean
  weight: number
  dimensions: string
  warranty: string
  tags: string
  specifications: Record<string, string | number | boolean>
  seoTitle: string
  seoDescription: string
  images: string[]
}

export default function NewProductPage() {  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [specificationTemplate, setSpecificationTemplate] = useState<CategorySpecTemplate | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    sku: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    categoryId: '',
    brandId: '',
    isActive: true,
    isFeatured: false,
    weight: 0,
    dimensions: '',
    warranty: '',
    tags: '',
    specifications: {},
    seoTitle: '',
    seoDescription: '',
    images: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCategories()
    fetchBrands()
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

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/admin/brands')
      const data = await response.json()
      if (data.success) {
        setBrands(data.brands)
      }
    } catch (error) {
      console.error('Failed to fetch brands:', error)
    }
  }
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }))    // Handle category change to update specification template
    if (name === 'categoryId') {
      const category = categories.find(cat => cat.id === value)

      if (category) {
        // Fetch category details from backend to get specificationTemplate
        try {
          const response = await fetch(`/api/admin/categories/${category.id}`)
          const data = await response.json()
          if (data.success && data.category) {
            let template = null
            if (data.category.specificationTemplate) {
              try {
                let fields = JSON.parse(data.category.specificationTemplate)
                // Defensive: ensure fields is always an array of objects
                if (Array.isArray(fields)) {
                  // Check if array but contains only one object with keys of all fields (bad export)
                  if (fields.length === 1 && typeof fields[0] === 'object' && !Array.isArray(fields[0]) && Object.keys(fields[0]).every(k => typeof fields[0][k] === 'object' && fields[0][k].key)) {
                    // Convert object-of-fields to array
                    fields = Object.values(fields[0])
                  }
                } else if (typeof fields === 'object' && fields !== null) {
                  // If it's a single object, wrap in array
                  fields = [fields]
                } else {
                  fields = []
                }
                template = {
                  categoryName: data.category.name,
                  categorySlug: data.category.slug,
                  fields: fields || []
                }
              } catch (err) {
                console.error('Failed to parse specificationTemplate:', err)
              }
            }
            setSpecificationTemplate(template)
          } else {
            setSpecificationTemplate(null)
          }
        } catch (err) {
          console.error('Failed to fetch category details:', err)
          setSpecificationTemplate(null)
        }
        // Reset specifications when category changes
        setFormData(prev => ({
          ...prev,
          specifications: {}
        }))
      } else {
        setSpecificationTemplate(null)
      }
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }
  const handleSpecificationChange = (key: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }))
  }

  const handleImageChange = (imagePath: string | null) => {
    if (imagePath) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imagePath]
      }))
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }
  const addSpecification = () => {
    const key = prompt('Enter specification name:')
    if (key && key.trim()) {
      handleSpecificationChange(key.trim(), '')
    }
  }

  const removeSpecification = (key: string) => {
    setFormData(prev => {
      const newSpecs = { ...prev.specifications }
      delete newSpecs[key]
      return { ...prev, specifications: newSpecs }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (!formData.categoryId) newErrors.categoryId = 'Category is required'
    if (!formData.brandId) newErrors.brandId = 'Brand is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
      // Convert tags string to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      
      // Generate slug from name
      const slug = formData.name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      const submitData = {
        name: formData.name,
        slug: slug,
        description: formData.description,
        shortDescription: formData.description, // Use description as shortDescription for now
        sku: formData.sku,
        price: Number(formData.price),
        comparePrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        costPrice: formData.costPrice ? Number(formData.costPrice) : undefined,
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.minStock) || 5,
        weight: formData.weight ? Number(formData.weight) : undefined,
        dimensions: formData.dimensions || undefined,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        metaTitle: formData.seoTitle || undefined,
        metaDescription: formData.seoDescription || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        specifications: Object.keys(formData.specifications).length > 0 ? formData.specifications : undefined,
        images: formData.images.length > 0 ? formData.images : undefined,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
      }

      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/products')
      } else {
        console.error('Product creation error:', data)
        
        // Handle validation errors
        if (data.details && Array.isArray(data.details)) {
          const validationErrors: Record<string, string> = {}
          data.details.forEach((error: { path?: string[]; message: string }) => {
            if (error.path && error.path.length > 0) {
              validationErrors[error.path[0]] = error.message
            }
          })
          setErrors(validationErrors)
        } else {
          setErrors({ general: data.error || 'Failed to create product' })
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ general: 'Failed to create product' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product in your catalog</p>
        </div>
        <Link 
          href="/admin/products"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          Back to Products
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
                Product Name *
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
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.sku ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter SKU"
              />
              {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku}</p>}
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
                placeholder="Enter product description"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Pricing & Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>              <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Cost Price (Rs)
              </label>
              <input
                type="number"
                id="costPrice"
                name="costPrice"
                min="0"
                step="0.01"
                value={formData.costPrice}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="minStock" className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock
              </label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                min="0"
                value={formData.minStock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>

            <div>
              <label htmlFor="maxStock" className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Stock
              </label>
              <input
                type="number"
                id="maxStock"
                name="maxStock"
                min="0"
                value={formData.maxStock}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Category & Brand */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Category & Brand</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.categoryId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.parentCategory ? `${category.parentCategory.name} > ` : ''}{category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-600 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <select
                id="brandId"
                name="brandId"
                value={formData.brandId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.brandId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              {errors.brandId && <p className="text-red-600 text-sm mt-1">{errors.brandId}</p>}
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                min="0"
                step="0.01"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                id="dimensions"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30 x 20 x 15 cm"
              />
            </div>

            <div>
              <label htmlFor="warranty" className="block text-sm font-medium text-gray-700 mb-1">
                Warranty
              </label>
              <input
                type="text"
                id="warranty"
                name="warranty"
                value={formData.warranty}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 2 years"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="gaming, rgb, performance"
              />
            </div>
          </div>
        </div>        {/* Dynamic Specifications */}
        <DynamicSpecifications
          template={specificationTemplate}
          specifications={formData.specifications}
          onChange={handleSpecificationChange}
          onCustomFieldAdd={addSpecification}
          onCustomFieldRemove={removeSpecification}
          errors={errors}
        />

        {/* Images */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Product Images</h2>
          
          <ImageUpload
            onImageChange={handleImageChange}
            directory="products"
            label="Add Product Image"
            className="mb-4"
          />

          {formData.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Current Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (                  <div key={index} className="relative group">
                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      width={200}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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
                placeholder="Leave empty to use product name"
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
                Active (Product will be visible to customers)
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
                Featured (Product will appear in featured sections)
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link 
            href="/admin/products"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}
