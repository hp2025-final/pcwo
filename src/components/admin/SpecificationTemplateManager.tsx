'use client'

import React, { useState } from 'react'
import { SpecificationField } from '@/lib/specification-templates'

interface SpecificationTemplateManagerProps {
  fields: SpecificationField[]
  onChange: (fields: SpecificationField[]) => void
  errors?: Record<string, string>
}

export default function SpecificationTemplateManager({
  fields,
  onChange
}: SpecificationTemplateManagerProps) {
  const [isAddingField, setIsAddingField] = useState(false)
  const [newField, setNewField] = useState<Partial<SpecificationField>>({
    key: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: ''
  })

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'boolean', label: 'Boolean (Checkbox)' },
    { value: 'textarea', label: 'Textarea' }
  ]

  const addField = () => {
    if (!newField.key || !newField.label || !newField.type) {
      return
    }

    const field: SpecificationField = {
      key: newField.key,
      label: newField.label,
      type: newField.type as 'text' | 'number' | 'select' | 'boolean' | 'textarea',
      required: newField.required || false,
      placeholder: newField.placeholder || undefined,
      description: newField.description || undefined,
      unit: newField.unit || undefined,
      options: newField.options || undefined
    }

    onChange([...fields, field])
    setNewField({
      key: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: ''
    })
    setIsAddingField(false)
  }

  const removeField = (index: number) => {
    const updatedFields = fields.filter((_, i) => i !== index)
    onChange(updatedFields)
  }

  const updateField = (index: number, updatedField: SpecificationField) => {
    const updatedFields = fields.map((field, i) => 
      i === index ? updatedField : field
    )
    onChange(updatedFields)
  }

  const duplicateField = (index: number) => {
    const fieldToDuplicate = fields[index]
    const duplicatedField = {
      ...fieldToDuplicate,
      key: `${fieldToDuplicate.key}_copy`,
      label: `${fieldToDuplicate.label} (Copy)`
    }
    onChange([...fields, duplicatedField])
  }

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= fields.length) return

    const updatedFields = [...fields]
    const [movedField] = updatedFields.splice(index, 1)
    updatedFields.splice(newIndex, 0, movedField)
    onChange(updatedFields)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Specification Template</h2>
          <p className="text-sm text-gray-500 mt-1">
            Define the specification fields that will appear when adding products to this category
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddingField(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
        >
          Add Field
        </button>
      </div>

      {/* Existing Fields */}
      <div className="space-y-4">
        {fields.map((field, index) => (
          <FieldEditor
            key={`${field.key}-${index}`}
            field={field}
            index={index}
            onUpdate={(updatedField) => updateField(index, updatedField)}
            onRemove={() => removeField(index)}
            onDuplicate={() => duplicateField(index)}
            onMoveUp={index > 0 ? () => moveField(index, 'up') : undefined}
            onMoveDown={index < fields.length - 1 ? () => moveField(index, 'down') : undefined}
          />
        ))}

        {fields.length === 0 && !isAddingField && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No specification fields defined yet.</p>
            <p className="text-sm">Click &quot;Add Field&quot; to create your first specification field.</p>
          </div>
        )}
      </div>

      {/* Add New Field Form */}
      {isAddingField && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-md font-medium text-gray-900 mb-4">Add New Field</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Key *
              </label>
              <input
                type="text"
                value={newField.key}
                onChange={(e) => setNewField(prev => ({ ...prev, key: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., cores, memory, socket"
              />
              <p className="text-xs text-gray-500 mt-1">Unique identifier (no spaces or special characters)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Label *
              </label>
              <input
                type="text"
                value={newField.label}
                onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Core Count, Memory Size"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Type *
              </label>
              <select
                value={newField.type}
                onChange={(e) => setNewField(prev => ({ ...prev, type: e.target.value as 'text' | 'number' | 'select' | 'boolean' | 'textarea' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unit (for numbers)
              </label>
              <input
                type="text"
                value={newField.unit || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., GHz, GB, W, mm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placeholder Text
              </label>
              <input
                type="text"
                value={newField.placeholder || ''}
                onChange={(e) => setNewField(prev => ({ ...prev, placeholder: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Help text for users"
              />
            </div>

            {newField.type === 'select' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  value={newField.options?.join(', ') || ''}
                  onChange={(e) => setNewField(prev => ({ 
                    ...prev, 
                    options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Option 1, Option 2, Option 3"
                />
              </div>
            )}

            <div className="md:col-span-2 flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={newField.required || false}
                onChange={(e) => setNewField(prev => ({ ...prev, required: e.target.checked }))}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Required field
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddingField(false)
                setNewField({
                  key: '',
                  label: '',
                  type: 'text',
                  required: false,
                  placeholder: ''
                })
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addField}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Add Field
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Individual Field Editor Component
interface FieldEditorProps {
  field: SpecificationField
  index: number
  onUpdate: (field: SpecificationField) => void
  onRemove: () => void
  onDuplicate: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

function FieldEditor({ 
  field, 
  index, 
  onUpdate, 
  onRemove, 
  onDuplicate,
  onMoveUp,
  onMoveDown 
}: FieldEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editField, setEditField] = useState<SpecificationField>(field)

  const saveChanges = () => {
    onUpdate(editField)
    setIsEditing(false)
  }

  const cancelEditing = () => {
    setEditField(field)
    setIsEditing(false)
  }
  if (isEditing) {
    const fieldTypes = [
      { value: 'text', label: 'Text' },
      { value: 'number', label: 'Number' },
      { value: 'select', label: 'Select Dropdown' },
      { value: 'boolean', label: 'Boolean (Checkbox)' },
      { value: 'textarea', label: 'Textarea' }
    ]

    return (
      <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key</label>
            <input
              type="text"
              value={editField.key}
              onChange={(e) => setEditField(prev => ({ ...prev, key: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
            <input
              type="text"
              value={editField.label}
              onChange={(e) => setEditField(prev => ({ ...prev, label: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={editField.type}
              onChange={(e) => setEditField(prev => ({ ...prev, type: e.target.value as 'text' | 'number' | 'select' | 'boolean' | 'textarea' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {fieldTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <input
              type="text"
              value={editField.unit || ''}
              onChange={(e) => setEditField(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., GHz, GB, W, mm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder</label>
            <input
              type="text"
              value={editField.placeholder || ''}
              onChange={(e) => setEditField(prev => ({ ...prev, placeholder: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Help text for users"
            />
          </div>
          {editField.type === 'select' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options (comma-separated)
              </label>
              <input
                type="text"
                value={editField.options?.join(', ') || ''}
                onChange={(e) => setEditField(prev => ({ 
                  ...prev, 
                  options: e.target.value.split(',').map(opt => opt.trim()).filter(Boolean)
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Option 1, Option 2, Option 3"
              />
            </div>
          )}
          <div className="md:col-span-2 flex items-center">
            <input
              type="checkbox"
              id={`required-${index}`}
              checked={editField.required || false}
              onChange={(e) => setEditField(prev => ({ ...prev, required: e.target.checked }))}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor={`required-${index}`} className="ml-2 text-sm text-gray-700">
              Required field
            </label>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={cancelEditing}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveChanges}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{field.label}</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="bg-gray-100 px-2 py-1 rounded">{field.key}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{field.type}</span>
                {field.required && <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Required</span>}
                {field.unit && <span className="text-gray-400">({field.unit})</span>}
              </div>
              {field.placeholder && (
                <p className="text-xs text-gray-400 mt-1">Placeholder: {field.placeholder}</p>
              )}
              {field.options && (
                <p className="text-xs text-gray-400 mt-1">Options: {field.options.join(', ')}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Move up"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="text-gray-400 hover:text-gray-600 p-1"
              title="Move down"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 p-1"
            title="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            className="text-green-600 hover:text-green-800 p-1"
            title="Duplicate"
          >
            📋
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800 p-1"
            title="Remove"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
