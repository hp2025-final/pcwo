'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MenuFormData {
  name: string
  handle: string
  description: string
  location: 'HEADER' | 'FOOTER' | 'SIDEBAR' | 'MOBILE'
  isActive: boolean
}

interface Menu {
  id: string
  name: string
  handle: string
  description: string | null
  location: 'HEADER' | 'FOOTER' | 'SIDEBAR' | 'MOBILE'
  isActive: boolean
  _count: {
    items: number
  }
}

interface EditMenuPageProps {
  params: Promise<{ id: string }>
}

export default function EditMenuPage({ params }: EditMenuPageProps) {
  const router = useRouter()
  const [menuId, setMenuId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [menu, setMenu] = useState<Menu | null>(null)
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    handle: '',
    description: '',
    location: 'HEADER',
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  useEffect(() => {
    params.then(({ id }) => {
      setMenuId(id)
      fetchMenu(id)
    })
  }, [params])

  const fetchMenu = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/menus/${id}`)
      const data = await response.json()
      
      if (data.success && data.menu) {
        const menu = data.menu
        setMenu(menu)
        setFormData({
          name: menu.name,
          handle: menu.handle,
          description: menu.description || '',
          location: menu.location,
          isActive: menu.isActive
        })
      } else {
        setErrors({ general: 'Menu not found' })
      }    } catch {
      setErrors({ general: 'Failed to fetch menu' })
    } finally {
      setInitialLoading(false)
    }
  }

  const generateHandle = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Auto-generate handle when name changes (only if handle wasn't manually modified)
    if (name === 'name' && typeof newValue === 'string') {
      const newHandle = generateHandle(newValue)
      if (formData.handle === generateHandle(formData.name) || !formData.handle) {
        setFormData(prev => ({
          ...prev,
          handle: newHandle
        }))
      }
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.handle.trim()) newErrors.handle = 'Handle is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !menuId) return

    try {
      setLoading(true)
      
      const response = await fetch(`/api/admin/menus/${menuId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        router.push('/admin/menus')
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
          setErrors({ general: data.error || 'Failed to update menu' })
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ general: 'Failed to update menu' })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="p-8 text-center">Loading menu...</div>
  }

  if (!menu) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Menu not found</p>
        <Link 
          href="/admin/menus"
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Back to Menus
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Menu</h1>
          <p className="text-gray-600">Update menu information</p>
          {menu._count.items > 0 && (
            <p className="text-sm text-orange-600 mt-1">
              This menu has {menu._count.items} items
            </p>
          )}
        </div>        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/menus/${menuId}/items`}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Manage Items ({menu._count.items})
          </Link>
          <button
            onClick={() => window.open(`/admin/menus/${menuId}/preview`, '_blank')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Preview Menu
          </button>
          <Link 
            href="/admin/menus"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Menus
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
                Menu Name *
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
                placeholder="e.g., Main Menu, Footer Menu"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="handle" className="block text-sm font-medium text-gray-700 mb-1">
                Menu Handle *
              </label>
              <input
                type="text"
                id="handle"
                name="handle"
                value={formData.handle}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.handle ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="main-menu"
              />
              {errors.handle && <p className="text-red-600 text-sm mt-1">{errors.handle}</p>}
              <p className="text-xs text-gray-500 mt-1">Used to identify this menu in code</p>
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
                placeholder="Optional description of this menu"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Menu Location
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="HEADER">Header</option>
                <option value="FOOTER">Footer</option>
                <option value="SIDEBAR">Sidebar</option>
                <option value="MOBILE">Mobile</option>
              </select>
            </div>

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
                Active (Menu will be visible on the website)
              </label>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link 
            href="/admin/menus"
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
          >
            {loading ? 'Updating...' : 'Update Menu'}
          </button>
        </div>
      </form>
    </div>
  )
}
