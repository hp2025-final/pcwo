// Specification templates for different product categories

export interface SpecificationField {
  key: string
  label: string
  type: 'text' | 'number' | 'select' | 'boolean' | 'textarea'
  required?: boolean
  options?: string[] // For select type
  unit?: string // For number type (e.g., "GHz", "GB", "W")
  placeholder?: string
  description?: string
}

export interface CategorySpecTemplate {
  categoryName: string
  categorySlug: string
  fields: SpecificationField[]
}

// Predefined specification templates for common PC component categories
export const SPECIFICATION_TEMPLATES: CategorySpecTemplate[] = [
  {
    categoryName: 'Processors',
    categorySlug: 'processors',
    fields: [
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
        placeholder: 'e.g., LGA1700, AM5'
      },
      {
        key: 'cores',
        label: 'Cores',
        type: 'number',
        required: true,
        unit: 'cores'
      },
      {
        key: 'threads',
        label: 'Threads',
        type: 'number',
        required: true,
        unit: 'threads'
      },
      {
        key: 'baseClock',
        label: 'Base Clock',
        type: 'number',
        required: true,
        unit: 'GHz',
        placeholder: '3.6'
      },
      {
        key: 'boostClock',
        label: 'Boost Clock',
        type: 'number',
        unit: 'GHz',
        placeholder: '4.9'
      },
      {
        key: 'cache',
        label: 'Cache',
        type: 'text',
        placeholder: 'e.g., 16MB L3'
      },
      {
        key: 'tdp',
        label: 'TDP',
        type: 'number',
        required: true,
        unit: 'W',
        placeholder: '65'
      },
      {
        key: 'integratedGraphics',
        label: 'Integrated Graphics',
        type: 'text',
        placeholder: 'e.g., Intel UHD Graphics 770'
      },
      {
        key: 'memorySupport',
        label: 'Memory Support',
        type: 'text',
        placeholder: 'e.g., DDR5-5600, DDR4-3200'
      },
      {
        key: 'warrantyPeriod',
        label: 'Warranty Period',
        type: 'select',
        required: false,
        options: ['1 Year', '2 Years', '3 Years', '5 Years', 'Lifetime'],
        description: 'Manufacturer warranty period'
      }
    ]
  },
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
      {
        key: 'memory',
        label: 'Memory',
        type: 'number',
        required: true,
        unit: 'GB',
        placeholder: '24'
      },
      {
        key: 'memoryType',
        label: 'Memory Type',
        type: 'select',
        required: true,
        options: ['GDDR6X', 'GDDR6', 'GDDR5', 'HBM2']
      },
      {
        key: 'memoryBus',
        label: 'Memory Bus',
        type: 'number',
        unit: 'bit',
        placeholder: '384'
      },
      {
        key: 'baseClock',
        label: 'Base Clock',
        type: 'number',
        unit: 'MHz',
        placeholder: '2230'
      },
      {
        key: 'boostClock',
        label: 'Boost Clock',
        type: 'number',
        unit: 'MHz',
        placeholder: '2520'
      },
      {
        key: 'cudaCores',
        label: 'CUDA Cores / Stream Processors',
        type: 'number',
        placeholder: '16384'
      },
      {
        key: 'powerConsumption',
        label: 'Power Consumption',
        type: 'number',
        unit: 'W',
        placeholder: '450'
      },
      {
        key: 'powerConnectors',
        label: 'Power Connectors',
        type: 'text',
        placeholder: 'e.g., 3x 8-pin PCIe'
      },
      {
        key: 'outputs',
        label: 'Display Outputs',
        type: 'text',
        placeholder: 'e.g., 3x DisplayPort 1.4a, 1x HDMI 2.1'
      },
      {
        key: 'length',
        label: 'Length',
        type: 'number',
        unit: 'mm',
        placeholder: '336'
      },
      {
        key: 'slots',
        label: 'Slot Width',
        type: 'number',
        unit: 'slots',
        placeholder: '3'
      }
    ]
  },
  {
    categoryName: 'Motherboards',
    categorySlug: 'motherboards',
    fields: [
      {
        key: 'socket',
        label: 'Socket Type',
        type: 'text',
        required: true,
        placeholder: 'e.g., LGA1700, AM5'
      },
      {
        key: 'chipset',
        label: 'Chipset',
        type: 'text',
        required: true,
        placeholder: 'e.g., Z790, X670E'
      },
      {
        key: 'formFactor',
        label: 'Form Factor',
        type: 'select',
        required: true,
        options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX']
      },
      {
        key: 'memorySlots',
        label: 'Memory Slots',
        type: 'number',
        required: true,
        unit: 'slots',
        placeholder: '4'
      },
      {
        key: 'memoryType',
        label: 'Memory Type',
        type: 'select',
        required: true,
        options: ['DDR5', 'DDR4', 'DDR3']
      },
      {
        key: 'maxMemory',
        label: 'Max Memory',
        type: 'number',
        unit: 'GB',
        placeholder: '128'
      },
      {
        key: 'pciSlots',
        label: 'PCIe Slots',
        type: 'text',
        placeholder: 'e.g., 2x PCIe 5.0 x16, 1x PCIe 4.0 x16'
      },
      {
        key: 'sataConnectors',
        label: 'SATA Connectors',
        type: 'number',
        unit: 'ports',
        placeholder: '6'
      },
      {
        key: 'm2Slots',
        label: 'M.2 Slots',
        type: 'text',
        placeholder: 'e.g., 4x M.2 (PCIe 4.0)'
      },
      {
        key: 'rearIO',
        label: 'Rear I/O',
        type: 'textarea',
        placeholder: 'List rear panel connectors'
      },
      {
        key: 'networking',
        label: 'Networking',
        type: 'text',
        placeholder: 'e.g., 2.5GbE LAN, Wi-Fi 6E'
      },
      {
        key: 'audio',
        label: 'Audio',
        type: 'text',
        placeholder: 'e.g., Realtek ALC4080'
      }
    ]
  },
  {
    categoryName: 'Memory',
    categorySlug: 'memory',
    fields: [
      {
        key: 'type',
        label: 'Memory Type',
        type: 'select',
        required: true,
        options: ['DDR5', 'DDR4', 'DDR3']
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'number',
        required: true,
        unit: 'GB',
        placeholder: '32'
      },
      {
        key: 'speed',
        label: 'Speed',
        type: 'number',
        required: true,
        unit: 'MHz',
        placeholder: '6000'
      },
      {
        key: 'modules',
        label: 'Module Configuration',
        type: 'text',
        required: true,
        placeholder: 'e.g., 2x16GB, 4x8GB'
      },
      {
        key: 'timings',
        label: 'Timings',
        type: 'text',
        placeholder: 'e.g., CL30-36-36-76'
      },
      {
        key: 'voltage',
        label: 'Voltage',
        type: 'number',
        unit: 'V',
        placeholder: '1.35'
      },
      {
        key: 'heatspreader',
        label: 'Heat Spreader',
        type: 'boolean'
      },
      {
        key: 'rgb',
        label: 'RGB Lighting',
        type: 'boolean'
      }
    ]
  },
  {
    categoryName: 'Storage',
    categorySlug: 'storage',
    fields: [
      {
        key: 'type',
        label: 'Storage Type',
        type: 'select',
        required: true,
        options: ['NVMe SSD', 'SATA SSD', 'HDD']
      },
      {
        key: 'capacity',
        label: 'Capacity',
        type: 'number',
        required: true,
        unit: 'GB',
        placeholder: '1000'
      },
      {
        key: 'interface',
        label: 'Interface',
        type: 'text',
        required: true,
        placeholder: 'e.g., PCIe 4.0 x4, SATA 6Gb/s'
      },
      {
        key: 'formFactor',
        label: 'Form Factor',
        type: 'select',
        options: ['M.2 2280', 'M.2 2242', '2.5"', '3.5"']
      },
      {
        key: 'readSpeed',
        label: 'Read Speed',
        type: 'number',
        unit: 'MB/s',
        placeholder: '7000'
      },
      {
        key: 'writeSpeed',
        label: 'Write Speed',
        type: 'number',
        unit: 'MB/s',
        placeholder: '6000'
      },
      {
        key: 'nandType',
        label: 'NAND Type',
        type: 'select',
        options: ['3D TLC', '3D QLC', '3D MLC', 'SLC']
      },
      {
        key: 'controller',
        label: 'Controller',
        type: 'text',
        placeholder: 'e.g., Phison E26'
      },
      {
        key: 'endurance',
        label: 'Endurance (TBW)',
        type: 'number',
        unit: 'TB',
        placeholder: '600'
      }
    ]
  },
  {
    categoryName: 'Power Supplies',
    categorySlug: 'power-supplies',
    fields: [
      {
        key: 'wattage',
        label: 'Wattage',
        type: 'number',
        required: true,
        unit: 'W',
        placeholder: '850'
      },
      {
        key: 'efficiency',
        label: 'Efficiency Rating',
        type: 'select',
        required: true,
        options: ['80+ Titanium', '80+ Platinum', '80+ Gold', '80+ Silver', '80+ Bronze', '80+ White']
      },
      {
        key: 'modular',
        label: 'Modular Type',
        type: 'select',
        required: true,
        options: ['Fully Modular', 'Semi-Modular', 'Non-Modular']
      },
      {
        key: 'formFactor',
        label: 'Form Factor',
        type: 'select',
        options: ['ATX', 'SFX', 'SFX-L']
      },
      {
        key: 'pciConnectors',
        label: 'PCIe Connectors',
        type: 'text',
        placeholder: 'e.g., 4x 8-pin PCIe'
      },
      {
        key: 'sataConnectors',
        label: 'SATA Connectors',
        type: 'number',
        unit: 'connectors',
        placeholder: '10'
      },
      {
        key: 'fanSize',
        label: 'Fan Size',
        type: 'number',
        unit: 'mm',
        placeholder: '140'
      },
      {
        key: 'length',
        label: 'Length',
        type: 'number',
        unit: 'mm',
        placeholder: '160'
      }
    ]
  },
  {
    categoryName: 'Cases',
    categorySlug: 'cases',
    fields: [
      {
        key: 'type',
        label: 'Case Type',
        type: 'select',
        required: true,
        options: ['Full Tower', 'Mid Tower', 'Mini ITX', 'Micro ATX', 'Desktop', 'HTPC']
      },
      {
        key: 'motherboardSupport',
        label: 'Motherboard Support',
        type: 'text',
        required: true,
        placeholder: 'e.g., ATX, Micro-ATX, Mini-ITX'
      },
      {
        key: 'maxGpuLength',
        label: 'Max GPU Length',
        type: 'number',
        unit: 'mm',
        placeholder: '420'
      },
      {
        key: 'maxCpuCoolerHeight',
        label: 'Max CPU Cooler Height',
        type: 'number',
        unit: 'mm',
        placeholder: '165'
      },
      {
        key: 'driveBays',
        label: 'Drive Bays',
        type: 'text',
        placeholder: 'e.g., 2x 3.5", 4x 2.5"'
      },
      {
        key: 'expansionSlots',
        label: 'Expansion Slots',
        type: 'number',
        unit: 'slots',
        placeholder: '7'
      },
      {
        key: 'frontIO',
        label: 'Front I/O',
        type: 'text',
        placeholder: 'e.g., 2x USB 3.0, 1x USB-C, Audio'
      },
      {
        key: 'fanSupport',
        label: 'Fan Support',
        type: 'textarea',
        placeholder: 'List fan mounting positions and sizes'
      },
      {
        key: 'radiatorSupport',
        label: 'Radiator Support',
        type: 'text',
        placeholder: 'e.g., Front: 360mm, Top: 280mm'
      },
      {
        key: 'windowPanel',
        label: 'Window Panel',
        type: 'select',
        options: ['Tempered Glass', 'Acrylic', 'None']
      }
    ]
  },
  {
    categoryName: 'Cooling',
    categorySlug: 'cooling',
    fields: [
      {
        key: 'type',
        label: 'Cooler Type',
        type: 'select',
        required: true,
        options: ['Air Cooler', 'AIO Liquid', 'Custom Loop', 'Case Fan']
      },
      {
        key: 'socket',
        label: 'Socket Compatibility',
        type: 'text',
        required: true,
        placeholder: 'e.g., LGA1700, AM5, AM4'
      },
      {
        key: 'height',
        label: 'Height',
        type: 'number',
        unit: 'mm',
        placeholder: '158'
      },
      {
        key: 'fanSize',
        label: 'Fan Size',
        type: 'text',
        placeholder: 'e.g., 120mm, 140mm, 2x 140mm'
      },
      {
        key: 'radiatorSize',
        label: 'Radiator Size',
        type: 'text',
        placeholder: 'e.g., 240mm, 280mm, 360mm'
      },
      {
        key: 'fanSpeed',
        label: 'Fan Speed',
        type: 'text',
        placeholder: 'e.g., 500-1800 RPM'
      },
      {
        key: 'noiseLevel',
        label: 'Noise Level',
        type: 'text',
        unit: 'dBA',
        placeholder: 'e.g., 22.5 dBA'
      },
      {
        key: 'tdpRating',
        label: 'TDP Rating',
        type: 'number',
        unit: 'W',
        placeholder: '250'
      }
    ]
  }
]

// Helper function to get specification template by category name or slug
export function getSpecificationTemplate(categoryNameOrSlug: string): CategorySpecTemplate | null {
  const normalized = categoryNameOrSlug.toLowerCase().trim()
  return SPECIFICATION_TEMPLATES.find(
    template => 
      template.categoryName.toLowerCase() === normalized ||
      template.categorySlug === normalized ||
      template.categoryName.toLowerCase().includes(normalized) ||
      normalized.includes(template.categorySlug)
  ) || null
}

// Helper function to get all available categories with templates
export function getAvailableTemplateCategories(): string[] {
  return SPECIFICATION_TEMPLATES.map(template => template.categoryName)
}

// Function to retrieve a specification template by category name
export function getSpecificationTemplateByName(categoryName: string): CategorySpecTemplate | null {
  const foundTemplate = SPECIFICATION_TEMPLATES.find(
    (template) => template.categoryName.toLowerCase() === categoryName.toLowerCase()
  );
  return foundTemplate || null;
}
