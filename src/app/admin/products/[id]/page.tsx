'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ImageUpload from '@/components/admin/ImageUpload'
import DynamicSpecifications from '@/components/admin/DynamicSpecifications'
import { getSpecificationTemplate, CategorySpecTemplate } from '@/lib/specification-templates'

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

interface Product {
  id: string
  name: string
  description: string | null
  sku: string
  price: number
  costPrice: number | null
  stock: number
  minStock: number | null
  maxStock: number | null
  categoryId: string
  brandId: string
  isActive: boolean
  isFeatured: boolean
  weight: number | null
  dimensions: string | null
  warranty: string | null
  tags: string[]
  specifications: Record<string, string | number | boolean> | null
  seoTitle: string | null
  seoDescription: string | null
  images: string[]
  category: { id: string; name: string }
  brand: { id: string; name: string }
}

interface ProductFormData {
  name: string
  description: string
  sku: string
  price: number
  costPrice: number
  stock: number
  lowStockThreshold: number
  categoryId: string
  brandId: string
  isActive: boolean
  isFeatured: boolean
  weight: number
  dimensions: string
  warranty: string
  tags: string
  specifications: Record<string, string | number | boolean>
  metaTitle: string
  metaDescription: string
  images: string[]
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [productId, setProductId] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [product, setProduct] = useState<Product | null>(null)
  const [specificationTemplate, setSpecificationTemplate] = useState<CategorySpecTemplate | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({    name: '',
    description: '',
    sku: '',
    price: 0,
    costPrice: 0,
    stock: 0,
    lowStockThreshold: 5,
    categoryId: '',
    brandId: '',
    isActive: true,
    isFeatured: false,
    weight: 0,
    dimensions: '',
    warranty: '',
    tags: '',
    specifications: {},
    metaTitle: '',
    metaDescription: '',
    images: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Resolve async params
  useEffect(() => {
    params.then(({ id }) => {
      setProductId(id)
    })  }, [params])
  
  const fetchProduct = useCallback(async () => {
    if (!productId) return
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`)
      const data = await response.json()
      
      if (data.success && data.product) {
        const product = data.product
        setProduct(product)
        // Populate form data
        setFormData({
          name: product.name,
          description: product.description || '',
          sku: product.sku,
          price: product.price,
          costPrice: product.costPrice || 0,
          stock: product.stock,
          lowStockThreshold: product.lowStockThreshold || 5,
          categoryId: product.categoryId,
          brandId: product.brandId,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          weight: product.weight || 0,
          dimensions: product.dimensions || '',
          warranty: product.warranty || '',
          tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
          specifications: product.specifications || {},
          metaTitle: product.metaTitle || '',
          metaDescription: product.metaDescription || '',
          images: product.images || []
        })
        
        // Set up specification template based on product category
        if (product.category) {
          const category = product.category
          // Category found, set specification template
          const template = getSpecificationTemplate(category.name)
          setSpecificationTemplate(template)
        }
      } else {
        setErrors({ general: 'Product not found' })
      }    } catch {
      setErrors({ general: 'Failed to fetch product' })    } finally {
      setInitialLoading(false)
    }
  }, [productId])

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
    }  }

  // Effect to trigger data fetching when productId changes
  useEffect(() => {
    if (productId) {
      fetchProduct()
      fetchCategories()
      fetchBrands()
    }
  }, [productId, fetchProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseFloat(value) || 0 : value
    }))
    
    // Handle category change to update specification template
    if (name === 'categoryId') {
      const category = categories.find(cat => cat.id === value)
      // Set specification template from category if available
      
      if (category) {
        const template = getSpecificationTemplate(category.name)
        setSpecificationTemplate(template)
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
        // Ensure proper data types for numbers
      const submitData = {
        ...formData,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        stock: Number(formData.stock),
        lowStockThreshold: Number(formData.lowStockThreshold),
        weight: Number(formData.weight),
        tags: tagsArray
      }

      console.log('Submitting product data:', JSON.stringify(submitData, null, 2))

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()
      console.log('API response:', data)

      if (data.success) {
        router.push('/admin/products')
      } else {
        console.error('Update failed:', data)
        setErrors({ general: data.error || 'Failed to update product' })
      }
    } catch (error) {
      console.error('Submit error:', error)
      setErrors({ general: 'Failed to update product' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/products')
      } else {
        setErrors({ general: data.error || 'Failed to delete product' })
      }    } catch {
      setErrors({ general: 'Failed to delete product' })
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

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
        <Link 
          href="/admin/products"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md transition-colors"
          >
            Delete
          </button>
          <Link 
            href="/admin/products"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Products
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
            </div>            <div>
              <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Low Stock Threshold
              </label>
              <input
                type="number"
                id="lowStockThreshold"
                name="lowStockThreshold"
                min="0"
                value={formData.lowStockThreshold}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
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
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">                    <Image
                      src={image}
                      alt={`Product image ${index + 1}`}
                      width={128}
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
          <div className="space-y-4">            <div>
              <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                id="metaTitle"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave empty to use product name"
              />
            </div>

            <div>
              <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Description
              </label>
              <textarea
                id="metaDescription"
                name="metaDescription"
                rows={3}
                value={formData.metaDescription}
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
            {loading ? 'Updating...' : 'Update Product'}
          </button>        </div>
      </form>
    </div>
  )
}
