'use client'

import React, { useState } from 'react'
import DynamicSpecifications from '@/components/admin/DynamicSpecifications'
import { SPECIFICATION_TEMPLATES, getSpecificationTemplate } from '@/lib/specification-templates'

export default function SpecificationDemo() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [specifications, setSpecifications] = useState<Record<string, string | number | boolean>>({})

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName)
    setSpecifications({}) // Reset specifications when template changes
  }

  const handleSpecificationChange = (key: string, value: string | number | boolean) => {
    setSpecifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const addCustomField = () => {
    const key = prompt('Enter specification name:')
    if (key && key.trim()) {
      handleSpecificationChange(key.trim(), '')
    }
  }

  const removeCustomField = (key: string) => {
    setSpecifications(prev => {
      const newSpecs = { ...prev }
      delete newSpecs[key]
      return newSpecs
    })
  }

  const currentTemplate = selectedTemplate ? getSpecificationTemplate(selectedTemplate) : null

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Dynamic Product Specifications Demo
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            This demo shows how specification fields change based on the selected product category.
            Each category has predefined fields with appropriate input types, validation, and units.
          </p>

          {/* Category Template Selector */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Select Product Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SPECIFICATION_TEMPLATES.map((template) => (
                <button
                  key={template.categorySlug}
                  onClick={() => handleTemplateChange(template.categoryName)}
                  className={`p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedTemplate === template.categoryName
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{template.categoryName}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {template.fields.length} fields
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Template Info */}
          {currentTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">
                Template: {currentTemplate.categoryName}
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                This template includes {currentTemplate.fields.length} predefined fields with smart input types:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {currentTemplate.fields.map((field) => (
                  <div key={field.key} className="text-xs bg-white rounded px-2 py-1">
                    <span className="font-medium">{field.label}</span>
                    <span className="text-gray-500 ml-1">({field.type})</span>
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                    {field.unit && <span className="text-gray-400 ml-1">{field.unit}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Specifications Component */}
        {selectedTemplate ? (
          <DynamicSpecifications
            template={currentTemplate}
            specifications={specifications}
            onChange={handleSpecificationChange}
            onCustomFieldAdd={addCustomField}
            onCustomFieldRemove={removeCustomField}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Select a Category Above
            </h3>
            <p className="text-gray-600">
              Choose a product category to see its dynamic specification fields in action.
            </p>
          </div>
        )}

        {/* Current Specifications Preview */}
        {Object.keys(specifications).length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Current Specifications (JSON Preview)
            </h3>
            <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto">
              {JSON.stringify(specifications, null, 2)}
            </pre>
          </div>
        )}

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-green-500 text-2xl mb-3">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart Field Types</h4>
            <p className="text-gray-600 text-sm">
              Number fields for specs like cores, speed, and capacity. Select dropdowns for predefined options. Boolean checkboxes for yes/no features.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-500 text-2xl mb-3">📏</div>
            <h4 className="font-semibold text-gray-900 mb-2">Units & Validation</h4>
            <p className="text-gray-600 text-sm">
              Automatic unit labels (GHz, GB, W) and built-in validation. Required fields are clearly marked and validated.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-purple-500 text-2xl mb-3">🔧</div>
            <h4 className="font-semibold text-gray-900 mb-2">Custom Fields</h4>
            <p className="text-gray-600 text-sm">
              Add custom specifications beyond the template. Perfect for unique or specialized product features.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-2">
            How to Use in Production
          </h3>
          <ol className="list-decimal list-inside text-yellow-800 space-y-1 text-sm">
            <li>Go to Admin → Products → Add New Product</li>
            <li>Select a category from the dropdown</li>
            <li>Watch the specifications section automatically update with relevant fields</li>
            <li>Fill in the template fields and add custom ones as needed</li>
            <li>Save the product with rich, structured specifications</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
