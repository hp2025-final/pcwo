// Complete guide to field types and configuration options

interface SpecificationField {
  key: string          // Unique identifier (required)
  label: string        // Display name (required)
  type: FieldType      // Input type (required)
  required?: boolean   // Is field mandatory?
  options?: string[]   // For select dropdowns
  unit?: string        // Unit display (e.g., "GHz", "GB")
  placeholder?: string // Placeholder text
  description?: string // Help text
}

// Available field types:
type FieldType = 'text' | 'number' | 'select' | 'boolean' | 'textarea'

// Field Type Examples:

// 1. TEXT FIELD
{
  key: 'socket',
  label: 'Socket Type',
  type: 'text',
  required: true,
  placeholder: 'e.g., LGA1700, AM5'
}

// 2. NUMBER FIELD
{
  key: 'cores',
  label: 'Core Count',
  type: 'number',
  required: true,
  unit: 'cores',
  placeholder: '8'
}

// 3. SELECT DROPDOWN
{
  key: 'formFactor',
  label: 'Form Factor',
  type: 'select',
  required: true,
  options: ['ATX', 'Micro-ATX', 'Mini-ITX']
}

// 4. BOOLEAN CHECKBOX
{
  key: 'rgbLighting',
  label: 'RGB Lighting',
  type: 'boolean',
  description: 'Does this product have RGB lighting?'
}

// 5. TEXTAREA FIELD
{
  key: 'features',
  label: 'Key Features',
  type: 'textarea',
  placeholder: 'List the main features...'
}
