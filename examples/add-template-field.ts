// Example: Adding a new field to the Processors template

// Open src/lib/specification-templates.ts
// Find the Processors template and add a new field:

{
  categoryName: 'Processors',
  categorySlug: 'processors',
  fields: [
    // ...existing fields...
    {
      key: 'architecture',  // NEW FIELD
      label: 'Architecture',
      type: 'text',
      required: false,
      placeholder: 'e.g., Zen 4, Golden Cove'
    },
    {
      key: 'manufacturingProcess',  // ANOTHER NEW FIELD
      label: 'Manufacturing Process',
      type: 'select',
      required: false,
      options: ['7nm', '5nm', '4nm', '3nm'],
      unit: 'nm'
    }
    // ...rest of existing fields...
  ]
}
