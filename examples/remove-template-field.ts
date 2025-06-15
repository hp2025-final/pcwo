// Example: Removing a field from the Graphics Cards template

// Open src/lib/specification-templates.ts
// Find the Graphics Cards template and remove the field:

{
  categoryName: 'Graphics Cards',
  categorySlug: 'graphics-cards',
  fields: [
    {
      key: 'gpu',
      label: 'GPU Chip',
      type: 'text',
      required: true,
      placeholder: 'e.g., RTX 4090, RX 7900 XTX'
    },
    // REMOVE this field by deleting it entirely:
    // {
    //   key: 'memoryBus',
    //   label: 'Memory Bus',
    //   type: 'number',
    //   unit: 'bit',
    //   placeholder: '384'
    // },
    {
      key: 'baseClock',
      label: 'Base Clock',
      type: 'number',
      unit: 'MHz',
      placeholder: '2230'
    }
    // ...rest of fields...
  ]
}
