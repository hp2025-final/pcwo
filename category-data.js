// Simple script to create categories via API
const categories = [
  {
    name: 'Processors',
    slug: 'processors',
    description: 'High-performance processors for PC builds',
    isActive: true,
    sortOrder: 0,
    specificationTemplate: JSON.stringify([
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        required: true,
        options: ['Intel', 'AMD']
      },
      {
        key: 'socket',
        label: 'Socket Type',
        type: 'text',
        required: true,
        placeholder: 'LGA1700'
      },
      {
        key: 'cores',
        label: 'Core Count',
        type: 'number',
        required: true,
        placeholder: '8'
      },
      {
        key: 'threads',
        label: 'Thread Count',
        type: 'number',
        required: true,
        placeholder: '16'
      },
      {
        key: 'baseClock',
        label: 'Base Clock',
        type: 'number',
        required: true,
        unit: 'GHz',
        placeholder: '3.2'
      },
      {
        key: 'boostClock',
        label: 'Boost Clock',
        type: 'number',
        unit: 'GHz',
        placeholder: '4.8'
      },
      {
        key: 'tdp',
        label: 'TDP',
        type: 'number',
        required: true,
        unit: 'W',
        placeholder: '125'
      },
      {
        key: 'integratedGraphics',
        label: 'Integrated Graphics',
        type: 'boolean'
      }
    ])
  },
  {
    name: 'Graphics Cards',
    slug: 'graphics-cards',
    description: 'High-performance graphics cards for gaming and content creation',
    isActive: true,
    sortOrder: 0,
    specificationTemplate: JSON.stringify([
      {
        key: 'brand',
        label: 'Brand',
        type: 'select',
        required: true,
        options: ['NVIDIA', 'AMD']
      },
      {
        key: 'chipset',
        label: 'GPU Chipset',
        type: 'text',
        required: true,
        placeholder: 'RTX 4080'
      },
      {
        key: 'memory',
        label: 'Video Memory',
        type: 'number',
        required: true,
        unit: 'GB',
        placeholder: '16'
      },
      {
        key: 'memoryType',
        label: 'Memory Type',
        type: 'select',
        required: true,
        options: ['GDDR6X', 'GDDR6', 'GDDR5', 'HBM2']
      },
      {
        key: 'baseClock',
        label: 'Base Clock',
        type: 'number',
        unit: 'MHz',
        placeholder: '2210'
      },
      {
        key: 'boostClock',
        label: 'Boost Clock',
        type: 'number',
        unit: 'MHz',
        placeholder: '2505'
      },
      {
        key: 'interface',
        label: 'Interface',
        type: 'select',
        required: true,
        options: ['PCIe 4.0 x16', 'PCIe 3.0 x16']
      },
      {
        key: 'powerRequirement',
        label: 'Power Requirement',
        type: 'number',
        unit: 'W',
        placeholder: '320'
      }
    ])
  }
];

console.log('Use this data to create categories with specification templates through the admin interface:');
console.log(JSON.stringify(categories, null, 2));
