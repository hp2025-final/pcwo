'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { buildMenuTree, getMenuItemLinkDescription, resolveMenuItemUrl } from '@/lib/menu-utils'

interface MenuItem {
  id: string
  label: string
  url: string | null
  linkType: 'CUSTOM' | 'PAGE' | 'CATEGORY' | 'PRODUCT' | 'SHOP' | 'BRAND' | 'HOME' | 'CONTACT' | 'ABOUT'
  linkValue: string | null
  target: string
  cssClass: string | null
  isActive: boolean
  sortOrder: number
  parentId: string | null
  children?: MenuItem[]
}

interface Menu {
  id: string
  name: string
  handle: string
  location: string
  isActive: boolean
}

interface MenuItemFormData {
  label: string
  linkType: 'CUSTOM' | 'PAGE' | 'CATEGORY' | 'PRODUCT' | 'SHOP' | 'BRAND' | 'HOME' | 'CONTACT' | 'ABOUT'
  linkValue: string
  url: string
  target: string
  cssClass: string
  isActive: boolean
  parentId: string
}

interface MenuItemsPageProps {
  params: Promise<{ id: string }>
}

export default function MenuItemsPage({ params }: MenuItemsPageProps) {
  const [menuId, setMenuId] = useState<string>('')
  const [menu, setMenu] = useState<Menu | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<MenuItemFormData>({
    label: '',
    linkType: 'CUSTOM',
    linkValue: '',
    url: '',
    target: '_self',
    cssClass: '',
    isActive: true,
    parentId: ''
  })

  useEffect(() => {
    params.then(resolvedParams => {
      setMenuId(resolvedParams.id)
      fetchMenuAndItems(resolvedParams.id)
    })
  }, [params])

  const fetchMenuAndItems = async (id: string) => {
    try {
      setLoading(true)
      
      // Fetch menu details
      const menuResponse = await fetch(`/api/admin/menus/${id}`)
      const menuData = await menuResponse.json()
      
      if (menuData.success) {
        setMenu(menuData.data)
      }      // Fetch menu items
      const itemsResponse = await fetch(`/api/admin/menus/${id}/items`)
      const itemsData = await itemsResponse.json()
      
      if (itemsData.success) {
        // Build hierarchical structure
        const hierarchicalItems = buildMenuTree(itemsData.data)
        setItems(hierarchicalItems)
      }
    } catch (error) {
      console.error('Error fetching menu and items:', error)
      setErrors({ general: 'Failed to load menu items' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      linkType: 'CUSTOM',
      linkValue: '',
      url: '',
      target: '_self',
      cssClass: '',
      isActive: true,
      parentId: ''
    })
    setEditingItem(null)
    setErrors({})
  }

  const handleShowForm = () => {
    resetForm()
    setShowForm(true)
  }

  const handleEditItem = (item: MenuItem) => {
    setFormData({
      label: item.label,
      linkType: item.linkType,
      linkValue: item.linkValue || '',
      url: item.url || '',
      target: item.target,
      cssClass: item.cssClass || '',
      isActive: item.isActive,
      parentId: item.parentId || ''
    })
    setEditingItem(item)
    setShowForm(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Clear specific field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSaving(true)

    try {
      const url = editingItem 
        ? `/api/admin/menus/${menuId}/items/${editingItem.id}`
        : `/api/admin/menus/${menuId}/items`
      
      const method = editingItem ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        await fetchMenuAndItems(menuId)
        setShowForm(false)
        resetForm()
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
          setErrors({ general: data.error || 'Failed to save menu item' })
        }
      }
    } catch (error) {
      console.error('Network error:', error)
      setErrors({ general: 'Failed to save menu item' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const response = await fetch(`/api/admin/menus/${menuId}/items/${itemId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        await fetchMenuAndItems(menuId)
      } else {
        setErrors({ general: data.error || 'Failed to delete menu item' })
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      setErrors({ general: 'Failed to delete menu item' })
    }
  }

  const handleToggleActive = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/admin/menus/${menuId}/items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchMenuAndItems(menuId)
      } else {
        setErrors({ general: data.error || 'Failed to update menu item' })
      }
    } catch (error) {
      console.error('Error updating menu item:', error)
      setErrors({ general: 'Failed to update menu item' })
    }
  }
  const renderMenuItems = (items: MenuItem[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.id} className={`border border-gray-200 rounded-lg mb-2 ${level > 0 ? 'ml-6' : ''}`}>
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">⋮⋮</span>
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">
                    {getMenuItemLinkDescription(item)}
                  </div>
                  <div className="text-xs text-gray-400">
                    URL: {resolveMenuItemUrl(item)}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleToggleActive(item)}
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  item.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {item.isActive ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => handleEditItem(item)}
                className="text-blue-600 hover:text-blue-900 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-600 hover:text-red-900 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        {item.children && item.children.length > 0 && (
          <div className="pb-2 pr-2">
            {renderMenuItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }
  const getParentItems = () => {
    const flatItems: MenuItem[] = []
    const flatten = (items: MenuItem[]) => {
      items.forEach(item => {
        flatItems.push(item)
        if (item.children) flatten(item.children)
      })
    }
    flatten(items)
    return flatItems.filter(item => editingItem ? item.id !== editingItem.id : true)
  }

  if (loading) {
    return <div className="p-8 text-center">Loading menu items...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Menu Items</h1>
          <p className="text-gray-600">
            Menu: <span className="font-medium">{menu.name}</span> ({menu.handle})
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShowForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Add Menu Item
          </button>
          <Link 
            href={`/admin/menus/${menuId}`}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{errors.general}</p>
        </div>
      )}

      {/* Menu Items List */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Menu Items ({items.length})</h2>
        </div>
        <div className="p-6">
          {items.length > 0 ? (
            <div className="space-y-2">
              {renderMenuItems(items)}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No menu items found</p>
              <button
                onClick={handleShowForm}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Add your first menu item
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <p className="text-red-700">{errors.general}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
                    Label *
                  </label>
                  <input
                    type="text"
                    id="label"
                    name="label"
                    value={formData.label}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.label ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Menu item label"
                  />
                  {errors.label && <p className="text-red-600 text-sm mt-1">{errors.label}</p>}
                </div>

                <div>
                  <label htmlFor="linkType" className="block text-sm font-medium text-gray-700 mb-1">
                    Link Type
                  </label>
                  <select
                    id="linkType"
                    name="linkType"
                    value={formData.linkType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CUSTOM">Custom URL</option>
                    <option value="HOME">Home Page</option>
                    <option value="CONTACT">Contact Page</option>
                    <option value="ABOUT">About Page</option>
                    <option value="PAGE">Static Page</option>
                    <option value="CATEGORY">Category</option>
                    <option value="PRODUCT">Product</option>
                    <option value="SHOP">Shop</option>
                    <option value="BRAND">Brand</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                    Target
                  </label>
                  <select
                    id="target"
                    name="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="_self">Same Window</option>
                    <option value="_blank">New Window</option>
                  </select>
                </div>

                {formData.linkType === 'CUSTOM' && (
                  <div className="md:col-span-2">
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      name="url"
                      value={formData.url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {['CATEGORY', 'PRODUCT', 'SHOP', 'BRAND', 'PAGE'].includes(formData.linkType) && (
                  <div className="md:col-span-2">
                    <label htmlFor="linkValue" className="block text-sm font-medium text-gray-700 mb-1">
                      {formData.linkType} ID/Slug
                    </label>
                    <input
                      type="text"
                      id="linkValue"
                      name="linkValue"
                      value={formData.linkValue}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Enter ${formData.linkType.toLowerCase()} ID or slug`}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Item (Optional)
                  </label>
                  <select
                    id="parentId"
                    name="parentId"
                    value={formData.parentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">No Parent (Top Level)</option>
                    {getParentItems().map(item => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="cssClass" className="block text-sm font-medium text-gray-700 mb-1">
                    CSS Class (Optional)
                  </label>
                  <input
                    type="text"
                    id="cssClass"
                    name="cssClass"
                    value={formData.cssClass}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="custom-class"
                  />
                </div>

                <div className="md:col-span-2 flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Active (Item will be visible in menu)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
                >
                  {saving ? 'Saving...' : (editingItem ? 'Update Item' : 'Add Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
