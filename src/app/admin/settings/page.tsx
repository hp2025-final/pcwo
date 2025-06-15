'use client'

import { useState, useEffect } from 'react'

interface SiteSettings {
  id: string
  key: string
  value: string
  description: string | null
}

interface SettingsGroup {
  [key: string]: string
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<SettingsGroup>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      
      if (data.success) {
        // Convert settings array to object for easier handling
        const settingsObj: SettingsGroup = {}
        data.settings.forEach((setting: SiteSettings) => {
          settingsObj[setting.key] = setting.value
        })
        setSettings(settingsObj)
      }    } catch {
      setErrors({ general: 'Failed to fetch settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    
    // Clear success message when user starts editing
    if (success) {
      setSuccess('')
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setErrors({})
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess('Settings saved successfully!')
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setErrors({ general: data.error || 'Failed to save settings' })
      }    } catch {
      setErrors({ general: 'Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-gray-600">Manage your store configuration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md transition-colors"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">{errors.general}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Store Information */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="store_name" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                id="store_name"
                value={settings.store_name || ''}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PC Wala Online"
              />
            </div>

            <div>
              <label htmlFor="store_email" className="block text-sm font-medium text-gray-700 mb-1">
                Store Email
              </label>
              <input
                type="email"
                id="store_email"
                value={settings.store_email || ''}
                onChange={(e) => handleInputChange('store_email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="info@pcwalaonline.com"
              />
            </div>

            <div>
              <label htmlFor="store_phone" className="block text-sm font-medium text-gray-700 mb-1">
                Store Phone
              </label>
              <input
                type="tel"
                id="store_phone"
                value={settings.store_phone || ''}
                onChange={(e) => handleInputChange('store_phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label htmlFor="store_whatsapp" className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                id="store_whatsapp"
                value={settings.store_whatsapp || ''}
                onChange={(e) => handleInputChange('store_whatsapp', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 9876543210"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="store_address" className="block text-sm font-medium text-gray-700 mb-1">
                Store Address
              </label>
              <textarea
                id="store_address"
                rows={3}
                value={settings.store_address || ''}
                onChange={(e) => handleInputChange('store_address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Complete store address"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="seo_title" className="block text-sm font-medium text-gray-700 mb-1">
                Default SEO Title
              </label>
              <input
                type="text"
                id="seo_title"
                value={settings.seo_title || ''}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PC Wala Online - Best PC Components Store"
              />
            </div>

            <div>
              <label htmlFor="seo_description" className="block text-sm font-medium text-gray-700 mb-1">
                Default SEO Description
              </label>
              <textarea
                id="seo_description"
                rows={3}
                value={settings.seo_description || ''}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Shop for the best PC components, gaming accessories, and custom PC builds at PC Wala Online"
              />
            </div>

            <div>
              <label htmlFor="seo_keywords" className="block text-sm font-medium text-gray-700 mb-1">
                Default Keywords
              </label>
              <input
                type="text"
                id="seo_keywords"
                value={settings.seo_keywords || ''}
                onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="PC components, gaming, motherboard, CPU, GPU"
              />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Analytics & Tracking</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="google_analytics_id" className="block text-sm font-medium text-gray-700 mb-1">
                Google Analytics ID
              </label>
              <input
                type="text"
                id="google_analytics_id"
                value={settings.google_analytics_id || ''}
                onChange={(e) => handleInputChange('google_analytics_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="G-XXXXXXXXXX"
              />
            </div>

            <div>
              <label htmlFor="facebook_pixel_id" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                id="facebook_pixel_id"
                value={settings.facebook_pixel_id || ''}
                onChange={(e) => handleInputChange('facebook_pixel_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234567890123456"
              />
            </div>

            <div>
              <label htmlFor="google_tag_manager_id" className="block text-sm font-medium text-gray-700 mb-1">
                Google Tag Manager ID
              </label>
              <input
                type="text"
                id="google_tag_manager_id"
                value={settings.google_tag_manager_id || ''}
                onChange={(e) => handleInputChange('google_tag_manager_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="GTM-XXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="razorpay_key_id" className="block text-sm font-medium text-gray-700 mb-1">
                Razorpay Key ID
              </label>
              <input
                type="text"
                id="razorpay_key_id"
                value={settings.razorpay_key_id || ''}
                onChange={(e) => handleInputChange('razorpay_key_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="rzp_test_xxxxxxxxx"
              />
            </div>

            <div>
              <label htmlFor="razorpay_key_secret" className="block text-sm font-medium text-gray-700 mb-1">
                Razorpay Key Secret
              </label>
              <input
                type="password"
                id="razorpay_key_secret"
                value={settings.razorpay_key_secret || ''}
                onChange={(e) => handleInputChange('razorpay_key_secret', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••••••••••"
              />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Maintenance & Features</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenance_mode"
                checked={settings.maintenance_mode === 'true'}
                onChange={(e) => handleInputChange('maintenance_mode', e.target.checked.toString())}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
                Maintenance Mode (Site will show maintenance page)
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allow_guest_checkout"
                checked={settings.allow_guest_checkout === 'true'}
                onChange={(e) => handleInputChange('allow_guest_checkout', e.target.checked.toString())}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="allow_guest_checkout" className="ml-2 block text-sm text-gray-900">
                Allow Guest Checkout
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_reviews"
                checked={settings.enable_reviews === 'true'}
                onChange={(e) => handleInputChange('enable_reviews', e.target.checked.toString())}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable_reviews" className="ml-2 block text-sm text-gray-900">
                Enable Product Reviews
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enable_wishlist"
                checked={settings.enable_wishlist === 'true'}
                onChange={(e) => handleInputChange('enable_wishlist', e.target.checked.toString())}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="enable_wishlist" className="ml-2 block text-sm text-gray-900">
                Enable Wishlist Feature
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
