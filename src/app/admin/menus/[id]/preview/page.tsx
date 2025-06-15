'use client'

import { useState, useEffect } from 'react'
import Menu from '@/components/public/Menu'

interface MenuData {
  id: string
  name: string
  handle: string
  location: string
  isActive: boolean
  _count: {
    items: number
  }
}

interface MenuPreviewPageProps {
  params: Promise<{ id: string }>
}

export default function MenuPreviewPage({ params }: MenuPreviewPageProps) {
  const [menu, setMenu] = useState<MenuData | null>(null)
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState<'horizontal' | 'vertical' | 'dropdown'>('horizontal')
  useEffect(() => {
    params.then(resolvedParams => {
      fetchMenu(resolvedParams.id)
    })
  }, [params])

  const fetchMenu = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/menus/${id}`)
      const data = await response.json()
      
      if (data.success) {
        setMenu(data.data)
      }
    } catch (error) {
      console.error('Error fetching menu:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading menu preview...</div>
  }

  if (!menu) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Menu not found</p>
        <button 
          onClick={() => window.close()}
          className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
        >
          Close Preview
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Menu Preview</h1>
            <p className="text-sm text-gray-600">
              {menu.name} ({menu.handle}) - {menu.location} - {menu._count.items} items
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setPreviewMode('horizontal')}
                className={`px-3 py-1 text-sm rounded-l-lg ${
                  previewMode === 'horizontal' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Horizontal
              </button>
              <button
                onClick={() => setPreviewMode('vertical')}
                className={`px-3 py-1 text-sm ${
                  previewMode === 'vertical' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Vertical
              </button>
              <button
                onClick={() => setPreviewMode('dropdown')}
                className={`px-3 py-1 text-sm rounded-r-lg ${
                  previewMode === 'dropdown' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Mobile
              </button>
            </div>
            <button
              onClick={() => window.close()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Preview based on location */}
            {menu.location === 'HEADER' && (
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Header Navigation Preview</h2>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-indigo-600">PC Wala Online</div>
                    <div className={previewMode === 'horizontal' ? 'flex space-x-4' : ''}>
                      <Menu 
                        handle={menu.handle}
                        renderMode={previewMode}
                        className={previewMode === 'vertical' ? 'space-y-2' : ''}
                        itemClassName="text-gray-600 hover:text-gray-900 px-3 py-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {menu.location === 'FOOTER' && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Footer Navigation Preview</h2>
                <div className="bg-gray-800 text-white rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">PC Wala Online</h3>
                      <p className="text-gray-300 text-sm">
                        Your premier destination for PC hardware and custom builds.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
                      <Menu 
                        handle={menu.handle}
                        renderMode="vertical"
                        className="space-y-2"
                        itemClassName="text-gray-300 hover:text-white text-sm"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
                      <div className="space-y-2">
                        <div><a href="#" className="text-gray-300 hover:text-white text-sm">Contact Us</a></div>
                        <div><a href="#" className="text-gray-300 hover:text-white text-sm">Help Center</a></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {menu.location === 'SIDEBAR' && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Sidebar Navigation Preview</h2>
                <div className="flex">
                  <div className="w-64 bg-gray-100 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-4">Sidebar Menu</h3>
                    <Menu 
                      handle={menu.handle}
                      renderMode="vertical"
                      className="space-y-1"
                      itemClassName="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-200 rounded"
                    />
                  </div>
                  <div className="flex-1 p-8 text-gray-500">
                    <p>Main content area...</p>
                  </div>
                </div>
              </div>
            )}

            {menu.location === 'MOBILE' && (
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Mobile Navigation Preview</h2>
                <div className="max-w-sm mx-auto bg-white border border-gray-300 rounded-lg overflow-hidden">
                  <div className="bg-white border-b border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold">Mobile Menu</div>
                      <div className="w-6 h-6 text-gray-400">✕</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200">
                    <Menu 
                      handle={menu.handle}
                      renderMode="dropdown"
                      className="divide-y divide-gray-200"
                      itemClassName="text-gray-900 hover:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* All Render Modes Preview */}
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">All Render Modes</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Horizontal Mode</h3>
                  <div className="bg-gray-50 rounded p-4">
                    <Menu 
                      handle={menu.handle}
                      renderMode="horizontal"
                      itemClassName="text-gray-600 hover:text-gray-900 px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Vertical Mode</h3>
                  <div className="bg-gray-50 rounded p-4 max-w-xs">
                    <Menu 
                      handle={menu.handle}
                      renderMode="vertical"
                      className="space-y-1"
                      itemClassName="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-200 rounded"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Dropdown/Mobile Mode</h3>
                  <div className="bg-gray-50 rounded p-4 max-w-xs">
                    <Menu 
                      handle={menu.handle}
                      renderMode="dropdown"
                      className="divide-y divide-gray-200 bg-white rounded border"
                      itemClassName="text-gray-900 hover:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
