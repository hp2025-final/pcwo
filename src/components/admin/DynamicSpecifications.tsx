'use client'

import React from 'react'
import { SpecificationField, CategorySpecTemplate } from '@/lib/specification-templates'

interface DynamicSpecificationsProps {
  template: CategorySpecTemplate | null
  specifications: Record<string, string | number | boolean>
  onChange: (key: string, value: string | number | boolean) => void
  onCustomFieldAdd?: () => void
  onCustomFieldRemove?: (key: string) => void
  errors?: Record<string, string>
}

export default function DynamicSpecifications({
  template,
  specifications,
  onChange,
  onCustomFieldAdd,
  onCustomFieldRemove,
  errors = {}
}: DynamicSpecificationsProps) {  const renderField = (field: SpecificationField) => {
    const rawValue = specifications[field.key]
    const value = rawValue !== undefined ? String(rawValue) : ''
    const booleanValue = rawValue === true || rawValue === 'true'
    const hasError = errors[field.key]

    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-red-300' : 'border-gray-300'
    }`

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && <p className="text-red-600 text-sm">{hasError}</p>}
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
              {field.unit && <span className="text-gray-500 ml-1">({field.unit})</span>}
            </label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => onChange(field.key, parseFloat(e.target.value) || '')}
              className={baseInputClasses}
              placeholder={field.placeholder}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && <p className="text-red-600 text-sm">{hasError}</p>}
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={baseInputClasses}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && <p className="text-red-600 text-sm">{hasError}</p>}
          </div>
        )

      case 'boolean':
        return (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={field.key}
                checked={booleanValue}
                onChange={(e) => onChange(field.key, e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor={field.key} className="text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            </div>
            {field.description && (
              <p className="text-xs text-gray-500 ml-6">{field.description}</p>
            )}
            {hasError && <p className="text-red-600 text-sm ml-6">{hasError}</p>}
          </div>
        )

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={baseInputClasses}
              placeholder={field.placeholder}
              rows={3}
            />
            {field.description && (
              <p className="text-xs text-gray-500">{field.description}</p>
            )}
            {hasError && <p className="text-red-600 text-sm">{hasError}</p>}
          </div>
        )

      default:
        return null
    }
  }

  // Get custom fields (fields not in template)
  const templateKeys = template?.fields.map(f => f.key) || []
  const customFields = Object.keys(specifications).filter(key => !templateKeys.includes(key))

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Specifications</h2>
          {template && (
            <p className="text-sm text-gray-500 mt-1">
              Template for: {template.categoryName}
            </p>
          )}
        </div>
        {onCustomFieldAdd && (
          <button
            type="button"
            onClick={onCustomFieldAdd}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm transition-colors"
          >
            Add Custom Field
          </button>
        )}
      </div>

      {/* Template Fields */}
      {template ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.fields.map(renderField)}
          </div>

          {/* Custom Fields Section */}
          {customFields.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-md font-medium text-gray-900 mb-4">Custom Fields</h3>
              <div className="space-y-3">
                {customFields.map((key) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={key}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        placeholder="Field name"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={String(specifications[key] || '')}
                        onChange={(e) => onChange(key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Field value"
                      />
                    </div>
                    {onCustomFieldRemove && (
                      <button
                        type="button"
                        onClick={() => onCustomFieldRemove(key)}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Fallback to manual specification entry */
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            No template available for this category. Add specifications manually.
          </p>
          
          {Object.entries(specifications).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={key}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="Specification name"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={value as string}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Specification value"
                />
              </div>
              {onCustomFieldRemove && (
                <button
                  type="button"
                  onClick={() => onCustomFieldRemove(key)}
                  className="text-red-600 hover:text-red-800 px-2 py-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          
          {Object.keys(specifications).length === 0 && (
            <p className="text-gray-500 text-sm">No specifications added yet. Click &quot;Add Custom Field&quot; to add some.</p>
          )}
        </div>
      )}
    </div>
  )
}
