import { PrismaClient, OrderStatus, PaymentStatus, PaymentMethod, ComponentType, SettingType } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed (excluding admin user)...')

  // Create categories with specification templates
  const categories = [
    {
      name: 'Processors (CPU)',
      slug: 'processors-cpu',
      description: 'Intel and AMD processors for gaming and professional workloads',
      isActive: true,
      sortOrder: 1,
      specificationTemplate: JSON.stringify([
        { name: 'Core Count', type: 'text', required: true, description: 'Number of physical cores' },
        { name: 'Thread Count', type: 'text', required: true, description: 'Number of threads supported' },
        { name: 'Base Clock', type: 'text', required: true, description: 'Base frequency in GHz' },
        { name: 'Boost Clock', type: 'text', required: true, description: 'Maximum boost frequency' },
        { name: 'Cache', type: 'text', required: true, description: 'Total cache size' },
        { name: 'Socket', type: 'select', required: true, options: ['LGA 1700', 'LGA 1200', 'AM4', 'AM5'], description: 'CPU socket type' },
        { name: 'TDP', type: 'text', required: true, description: 'Thermal Design Power in watts' },
        { name: 'Architecture', type: 'text', required: false, description: 'CPU architecture' },
        { name: 'Process Node', type: 'text', required: false, description: 'Manufacturing process in nm' }
      ])
    },
    {
      name: 'Motherboards',
      slug: 'motherboards',
      description: 'Compatible motherboards for Intel and AMD processors',
      isActive: true,
      sortOrder: 2,
      specificationTemplate: JSON.stringify([
        { name: 'Socket', type: 'select', required: true, options: ['LGA 1700', 'LGA 1200', 'AM4', 'AM5'], description: 'CPU socket type' },
        { name: 'Chipset', type: 'text', required: true, description: 'Motherboard chipset' },
        { name: 'Form Factor', type: 'select', required: true, options: ['ATX', 'Micro-ATX', 'Mini-ITX', 'E-ATX'], description: 'Board size' },
        { name: 'Memory Slots', type: 'number', required: true, description: 'Number of RAM slots' },
        { name: 'Max Memory', type: 'text', required: true, description: 'Maximum supported RAM' },
        { name: 'Memory Type', type: 'select', required: true, options: ['DDR4', 'DDR5'], description: 'Supported memory type' },
        { name: 'PCIe Slots', type: 'text', required: false, description: 'PCIe slot configuration' },
        { name: 'M.2 Slots', type: 'number', required: false, description: 'Number of M.2 slots' },
        { name: 'WiFi', type: 'boolean', required: false, description: 'Built-in WiFi support' },
        { name: 'Bluetooth', type: 'boolean', required: false, description: 'Built-in Bluetooth support' }
      ])
    },
    {
      name: 'Memory (RAM)',
      slug: 'memory-ram',
      description: 'DDR4 and DDR5 memory modules for optimal performance',
      isActive: true,
      sortOrder: 3,
      specificationTemplate: JSON.stringify([
        { name: 'Capacity', type: 'select', required: true, options: ['8GB', '16GB', '32GB', '64GB'], description: 'Memory capacity' },
        { name: 'Memory Type', type: 'select', required: true, options: ['DDR4', 'DDR5'], description: 'Memory generation' },
        { name: 'Speed', type: 'text', required: true, description: 'Memory speed (MHz)' },
        { name: 'Modules', type: 'select', required: true, options: ['1x8GB', '2x8GB', '2x16GB', '4x8GB', '4x16GB'], description: 'Module configuration' },
        { name: 'Latency', type: 'text', required: false, description: 'CAS latency timings' },
        { name: 'Voltage', type: 'text', required: false, description: 'Operating voltage' },
        { name: 'RGB', type: 'boolean', required: false, description: 'RGB lighting support' },
        { name: 'Heat Spreader', type: 'boolean', required: false, description: 'Heat spreader included' }
      ])
    },
    {
      name: 'Graphics Cards (GPU)',
      slug: 'graphics-cards-gpu',
      description: 'High-performance graphics cards for gaming and content creation',
      isActive: true,
      sortOrder: 4,
      specificationTemplate: JSON.stringify([
        { name: 'GPU Chip', type: 'text', required: true, description: 'Graphics processor model' },
        { name: 'VRAM', type: 'select', required: true, options: ['4GB', '6GB', '8GB', '12GB', '16GB', '24GB'], description: 'Video memory capacity' },
        { name: 'VRAM Type', type: 'select', required: true, options: ['GDDR6', 'GDDR6X'], description: 'Video memory type' },
        { name: 'Base Clock', type: 'text', required: true, description: 'Base clock speed in MHz' },
        { name: 'Boost Clock', type: 'text', required: true, description: 'Boost clock speed in MHz' },
        { name: 'Memory Clock', type: 'text', required: false, description: 'Memory clock speed' },
        { name: 'Interface', type: 'select', required: true, options: ['PCIe 4.0 x16', 'PCIe 3.0 x16'], description: 'Interface type' },
        { name: 'Power Connectors', type: 'text', required: true, description: 'Required power connectors' },
        { name: 'TDP', type: 'text', required: true, description: 'Total power consumption' },
        { name: 'Ray Tracing', type: 'boolean', required: false, description: 'Ray tracing support' },
        { name: 'DLSS/FSR', type: 'text', required: false, description: 'AI upscaling support' }
      ])
    },
    {
      name: 'Storage',
      slug: 'storage',
      description: 'SSDs, HDDs, and NVMe drives for data storage',
      isActive: true,
      sortOrder: 5,
      specificationTemplate: JSON.stringify([
        { name: 'Capacity', type: 'select', required: true, options: ['250GB', '500GB', '1TB', '2TB', '4TB', '8TB'], description: 'Storage capacity' },
        { name: 'Type', type: 'select', required: true, options: ['SSD', 'HDD', 'NVMe SSD'], description: 'Storage type' },
        { name: 'Interface', type: 'select', required: true, options: ['SATA 3.0', 'M.2 NVMe', 'M.2 SATA'], description: 'Connection interface' },
        { name: 'Form Factor', type: 'select', required: true, options: ['2.5"', '3.5"', 'M.2 2280', 'M.2 2242'], description: 'Physical size' },
        { name: 'Read Speed', type: 'text', required: false, description: 'Sequential read speed' },
        { name: 'Write Speed', type: 'text', required: false, description: 'Sequential write speed' },
        { name: 'NAND Type', type: 'select', required: false, options: ['TLC', 'QLC', 'MLC'], description: 'NAND flash type' },
        { name: 'Cache', type: 'text', required: false, description: 'Cache size' }
      ])
    },
    {
      name: 'Power Supplies (PSU)',
      slug: 'power-supplies-psu',
      description: 'Reliable power supplies for stable system operation',
      isActive: true,
      sortOrder: 6,
      specificationTemplate: JSON.stringify([
        { name: 'Wattage', type: 'select', required: true, options: ['450W', '550W', '650W', '750W', '850W', '1000W', '1200W'], description: 'Power output' },
        { name: 'Efficiency', type: 'select', required: true, options: ['80+ Bronze', '80+ Gold', '80+ Platinum', '80+ Titanium'], description: 'Efficiency rating' },
        { name: 'Modular', type: 'select', required: true, options: ['Non-Modular', 'Semi-Modular', 'Fully Modular'], description: 'Cable modularity' },
        { name: 'Form Factor', type: 'select', required: true, options: ['ATX', 'SFX', 'SFX-L'], description: 'PSU size standard' },
        { name: 'Fan Size', type: 'text', required: false, description: 'Cooling fan size' },
        { name: 'PCIe Connectors', type: 'text', required: false, description: 'Number of PCIe power connectors' },
        { name: 'SATA Connectors', type: 'text', required: false, description: 'Number of SATA power connectors' }
      ])
    },
    {
      name: 'Cases',
      slug: 'cases',
      description: 'PC cases and chassis for system builds',
      isActive: true,
      sortOrder: 7,
      specificationTemplate: JSON.stringify([
        { name: 'Form Factor', type: 'select', required: true, options: ['Full Tower', 'Mid Tower', 'Mini-ITX', 'Micro-ATX'], description: 'Case size' },
        { name: 'Motherboard Support', type: 'text', required: true, description: 'Supported motherboard sizes' },
        { name: 'GPU Clearance', type: 'text', required: false, description: 'Maximum GPU length' },
        { name: 'CPU Cooler Clearance', type: 'text', required: false, description: 'Maximum CPU cooler height' },
        { name: 'Front Fans', type: 'text', required: false, description: 'Front fan configuration' },
        { name: 'Top Fans', type: 'text', required: false, description: 'Top fan configuration' },
        { name: 'Rear Fans', type: 'text', required: false, description: 'Rear fan configuration' },
        { name: 'Side Panel', type: 'select', required: false, options: ['Solid', 'Tempered Glass', 'Acrylic'], description: 'Side panel type' },
        { name: 'Front I/O', type: 'text', required: false, description: 'Front panel connectors' }
      ])
    },
    {
      name: 'Cooling',
      slug: 'cooling',
      description: 'CPU coolers, case fans, and thermal solutions',
      isActive: true,
      sortOrder: 8,
      specificationTemplate: JSON.stringify([
        { name: 'Type', type: 'select', required: true, options: ['Air Cooler', 'AIO Liquid', 'Custom Loop'], description: 'Cooling type' },
        { name: 'Socket Support', type: 'text', required: true, description: 'Compatible CPU sockets' },
        { name: 'Fan Size', type: 'select', required: false, options: ['120mm', '140mm', '240mm', '280mm', '360mm'], description: 'Fan or radiator size' },
        { name: 'Height', type: 'text', required: false, description: 'Cooler height in mm' },
        { name: 'TDP Rating', type: 'text', required: false, description: 'Maximum TDP support' },
        { name: 'RPM Range', type: 'text', required: false, description: 'Fan speed range' },
        { name: 'Noise Level', type: 'text', required: false, description: 'Noise level in dBA' },
        { name: 'RGB', type: 'boolean', required: false, description: 'RGB lighting support' }
      ])
    },
    {
      name: 'Peripherals',
      slug: 'peripherals',
      description: 'Keyboards, mice, headsets, and other accessories',
      isActive: true,
      sortOrder: 9,
      specificationTemplate: JSON.stringify([
        { name: 'Type', type: 'select', required: true, options: ['Keyboard', 'Mouse', 'Headset', 'Monitor', 'Webcam'], description: 'Peripheral type' },
        { name: 'Connection', type: 'select', required: true, options: ['USB', 'Wireless', 'Bluetooth', 'USB-C'], description: 'Connection type' },
        { name: 'Gaming', type: 'boolean', required: false, description: 'Gaming optimized' },
        { name: 'RGB', type: 'boolean', required: false, description: 'RGB lighting support' },
        { name: 'Switch Type', type: 'text', required: false, description: 'Keyboard switch type' },
        { name: 'DPI', type: 'text', required: false, description: 'Mouse DPI range' },
        { name: 'Frequency Response', type: 'text', required: false, description: 'Headset frequency range' }
      ])
    }
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    })
    createdCategories.push(created)
    console.log('✅ Created category:', created.name)
  }

  // Create comprehensive brands
  const brands = [
    { name: 'Intel', slug: 'intel', description: 'Leading processor and chipset manufacturer', isActive: true },
    { name: 'AMD', slug: 'amd', description: 'Advanced processor and graphics solutions', isActive: true },
    { name: 'NVIDIA', slug: 'nvidia', description: 'Graphics processing units and AI computing', isActive: true },
    { name: 'ASUS', slug: 'asus', description: 'Motherboards, graphics cards, and peripherals', isActive: true },
    { name: 'MSI', slug: 'msi', description: 'Gaming motherboards and graphics cards', isActive: true },
    { name: 'Gigabyte', slug: 'gigabyte', description: 'Motherboards and graphics solutions', isActive: true },
    { name: 'ASRock', slug: 'asrock', description: 'Innovative motherboard designs', isActive: true },
    { name: 'Corsair', slug: 'corsair', description: 'Memory, power supplies, and cooling', isActive: true },
    { name: 'G.Skill', slug: 'gskill', description: 'High-performance memory solutions', isActive: true },
    { name: 'Kingston', slug: 'kingston', description: 'Memory and storage solutions', isActive: true },
    { name: 'Crucial', slug: 'crucial', description: 'Memory and SSD storage', isActive: true },
    { name: 'Samsung', slug: 'samsung', description: 'Memory and storage solutions', isActive: true },
    { name: 'Western Digital', slug: 'western-digital', description: 'Hard drives and SSD storage', isActive: true },
    { name: 'Seagate', slug: 'seagate', description: 'Hard drive and storage solutions', isActive: true },
    { name: 'EVGA', slug: 'evga', description: 'Graphics cards and power supplies', isActive: true },
    { name: 'Seasonic', slug: 'seasonic', description: 'Premium power supply units', isActive: true },
    { name: 'be quiet!', slug: 'be-quiet', description: 'Silent power supplies and cooling', isActive: true },
    { name: 'Noctua', slug: 'noctua', description: 'Premium CPU coolers and fans', isActive: true },
    { name: 'Cooler Master', slug: 'cooler-master', description: 'Cooling solutions and cases', isActive: true },
    { name: 'Fractal Design', slug: 'fractal-design', description: 'Minimalist PC cases', isActive: true },
    { name: 'NZXT', slug: 'nzxt', description: 'Gaming cases and cooling solutions', isActive: true },
    { name: 'Thermaltake', slug: 'thermaltake', description: 'Cases, cooling, and power supplies', isActive: true },
    { name: 'Logitech', slug: 'logitech', description: 'Gaming peripherals and accessories', isActive: true },
    { name: 'Razer', slug: 'razer', description: 'Gaming keyboards, mice, and headsets', isActive: true },
    { name: 'SteelSeries', slug: 'steelseries', description: 'Gaming peripherals and accessories', isActive: true }
  ]

  const createdBrands = []
  for (const brand of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: brand,
      create: brand,
    })
    createdBrands.push(created)
    console.log('✅ Created brand:', created.name)
  }

  // Get references to categories and brands
  const cpuCategory = createdCategories.find(c => c.slug === 'processors-cpu')
  const motherboardCategory = createdCategories.find(c => c.slug === 'motherboards')
  const memoryCategory = createdCategories.find(c => c.slug === 'memory-ram')
  const gpuCategory = createdCategories.find(c => c.slug === 'graphics-cards-gpu')
  const storageCategory = createdCategories.find(c => c.slug === 'storage')
  const psuCategory = createdCategories.find(c => c.slug === 'power-supplies-psu')
  const caseCategory = createdCategories.find(c => c.slug === 'cases')
  const coolingCategory = createdCategories.find(c => c.slug === 'cooling')
  const peripheralsCategory = createdCategories.find(c => c.slug === 'peripherals')

  const intelBrand = createdBrands.find(b => b.slug === 'intel')
  const amdBrand = createdBrands.find(b => b.slug === 'amd')
  const nvidiaBrand = createdBrands.find(b => b.slug === 'nvidia')
  const asusBrand = createdBrands.find(b => b.slug === 'asus')
  const msiBrand = createdBrands.find(b => b.slug === 'msi')
  const corsairBrand = createdBrands.find(b => b.slug === 'corsair')
  const gskillBrand = createdBrands.find(b => b.slug === 'gskill')
  const samsungBrand = createdBrands.find(b => b.slug === 'samsung')
  const seasonicBrand = createdBrands.find(b => b.slug === 'seasonic')
  const fractalBrand = createdBrands.find(b => b.slug === 'fractal-design')
  const noctuaBrand = createdBrands.find(b => b.slug === 'noctua')

  // Create realistic products with proper specifications
  const products = [
    // Intel CPUs
    {
      name: 'Intel Core i7-13700K',
      slug: 'intel-core-i7-13700k',
      description: 'High-performance 13th generation Intel processor for gaming and content creation with 16 cores and 24 threads',
      shortDescription: '16-core, 24-thread processor with excellent gaming performance',
      price: new Decimal(52999),
      comparePrice: new Decimal(54999),
      costPrice: new Decimal(50000),
      stock: 25,
      lowStockThreshold: 5,
      sku: 'CPU-INT-13700K',
      categorySlug: 'processors-cpu',
      brandSlug: 'intel',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Core Count': '16 (8P + 8E)',
        'Thread Count': '24',
        'Base Clock': '3.4 GHz (P-cores), 2.5 GHz (E-cores)',
        'Boost Clock': '5.4 GHz',
        'Cache': '30MB L3',
        'Socket': 'LGA 1700',
        'TDP': '125W',
        'Architecture': 'Raptor Lake',
        'Process Node': '10nm'
      }),
      images: JSON.stringify(['/products/cpu-i7-13700k-1.jpg']),
      metaTitle: 'Intel Core i7-13700K - High Performance Gaming CPU',
      metaDescription: 'Intel Core i7-13700K 16-core processor with 24 threads, perfect for gaming and content creation',
      tags: JSON.stringify(['gaming', 'performance', 'intel', '13th-gen'])
    },
    {
      name: 'AMD Ryzen 7 7800X3D',
      slug: 'amd-ryzen-7-7800x3d',
      description: 'Gaming-focused processor with 3D V-Cache technology for ultimate gaming performance',
      shortDescription: '8-core gaming beast with 3D V-Cache technology',
      price: new Decimal(58999),
      stock: 15,
      sku: 'CPU-AMD-7800X3D',
      categorySlug: 'processors-cpu',
      brandSlug: 'amd',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Core Count': '8',
        'Thread Count': '16',
        'Base Clock': '4.2 GHz',
        'Boost Clock': '5.0 GHz',
        'Cache': '96MB L3 (3D V-Cache)',
        'Socket': 'AM5',
        'TDP': '120W',
        'Architecture': 'Zen 4',
        'Process Node': '5nm'
      }),
      images: JSON.stringify(['/products/cpu-ryzen-7800x3d-1.jpg']),
      metaTitle: 'AMD Ryzen 7 7800X3D - Ultimate Gaming Processor',
      metaDescription: 'AMD Ryzen 7 7800X3D with 3D V-Cache technology for superior gaming performance',
      tags: JSON.stringify(['gaming', 'amd', 'ryzen', '3d-v-cache'])
    },
    // Motherboards
    {
      name: 'ASUS ROG STRIX Z790-E Gaming WiFi',
      slug: 'asus-rog-strix-z790-e-gaming-wifi',
      description: 'Premium Intel Z790 motherboard with advanced features, WiFi 6E, and robust VRM design',
      shortDescription: 'High-end Z790 motherboard with WiFi 6E and premium features',
      price: new Decimal(42999),
      stock: 12,
      sku: 'MB-ASUS-Z790E',
      categorySlug: 'motherboards',
      brandSlug: 'asus',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Socket': 'LGA 1700',
        'Chipset': 'Intel Z790',
        'Form Factor': 'ATX',
        'Memory Slots': '4',
        'Max Memory': '128GB DDR5',
        'Memory Type': 'DDR5',
        'PCIe Slots': '1x PCIe 5.0 x16, 2x PCIe 4.0 x16, 1x PCIe 3.0 x16',
        'M.2 Slots': '4',
        'WiFi': true,
        'Bluetooth': true
      }),
      images: JSON.stringify(['/products/mb-asus-z790e-1.jpg']),
      metaTitle: 'ASUS ROG STRIX Z790-E Gaming WiFi - Premium Motherboard',
      metaDescription: 'ASUS ROG STRIX Z790-E Gaming WiFi motherboard with advanced features for gamers',
      tags: JSON.stringify(['motherboard', 'asus', 'z790', 'gaming'])
    },
    {
      name: 'MSI MAG B650 TOMAHAWK WiFi',
      slug: 'msi-mag-b650-tomahawk-wifi',
      description: 'Solid mid-range AM5 motherboard with excellent value and robust feature set',
      shortDescription: 'Great value B650 board with WiFi and robust VRM',
      price: new Decimal(24999),
      salePrice: new Decimal(22999),
      stock: 20,
      sku: 'MB-MSI-B650TOM',
      categorySlug: 'motherboards',
      brandSlug: 'msi',
      isActive: true,
      isFeatured: false,
      specifications: JSON.stringify({
        'Socket': 'AM5',
        'Chipset': 'AMD B650',
        'Form Factor': 'ATX',
        'Memory Slots': '4',
        'Max Memory': '128GB DDR5',
        'Memory Type': 'DDR5',
        'PCIe Slots': '1x PCIe 4.0 x16, 2x PCIe 3.0 x16',
        'M.2 Slots': '2',
        'WiFi': true,
        'Bluetooth': true
      }),
      images: JSON.stringify(['/products/mb-msi-b650tom-1.jpg']),
      metaTitle: 'MSI MAG B650 TOMAHAWK WiFi - Mid-range Motherboard',
      metaDescription: 'MSI MAG B650 TOMAHAWK WiFi motherboard offers great value and features for gamers',
      tags: JSON.stringify(['motherboard', 'msi', 'b650', 'gaming'])
    },
    // Memory
    {
      name: 'G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5-6000',
      slug: 'gskill-trident-z5-rgb-32gb-ddr5-6000',
      description: 'High-performance DDR5 memory with stunning RGB lighting and excellent overclocking potential',
      shortDescription: 'Premium DDR5 memory with RGB and excellent overclocking',
      price: new Decimal(18999),
      salePrice: new Decimal(17499),
      stock: 35,
      sku: 'RAM-GSK-TZ5-32GB',
      categorySlug: 'memory-ram',
      brandSlug: 'gskill',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Capacity': '32GB',
        'Memory Type': 'DDR5',
        'Speed': '6000 MHz',
        'Modules': '2x16GB',
        'Latency': 'CL30-38-38-96',
        'Voltage': '1.35V',
        'RGB': true,
        'Heat Spreader': true
      }),
      images: JSON.stringify(['/products/ram-gskill-tz5-32gb-ddr5-6000-1.jpg']),
      metaTitle: 'G.Skill Trident Z5 RGB 32GB DDR5-6000 - High Performance RAM',
      metaDescription: 'G.Skill Trident Z5 RGB 32GB DDR5-6000 memory kit for high-performance gaming and content creation',
      tags: JSON.stringify(['ram', 'ddr5', 'gskill', 'rgb'])
    },
    {
      name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4-3200',
      slug: 'corsair-vengeance-lpx-16gb-ddr4-3200',
      description: 'Reliable DDR4 memory for mainstream gaming builds with proven compatibility',
      shortDescription: 'Proven DDR4 memory with low-profile design',
      price: new Decimal(7999),
      salePrice: new Decimal(7499),
      stock: 50,
      sku: 'RAM-COR-VLPX-16GB',
      categorySlug: 'memory-ram',
      brandSlug: 'corsair',
      isActive: true,
      isFeatured: false,
      specifications: JSON.stringify({
        'Capacity': '16GB',
        'Memory Type': 'DDR4',
        'Speed': '3200 MHz',
        'Modules': '2x8GB',
        'Latency': 'CL16-18-18-36',
        'Voltage': '1.35V',
        'RGB': false,
        'Heat Spreader': true
      }),
      images: JSON.stringify(['/products/ram-corsair-vlpx-16gb-ddr4-3200-1.jpg']),
      metaTitle: 'Corsair Vengeance LPX 16GB DDR4-3200 - Reliable RAM',
      metaDescription: 'Corsair Vengeance LPX 16GB DDR4-3200 memory kit for mainstream gaming and productivity',
      tags: JSON.stringify(['ram', 'ddr4', 'corsair', 'vengeance'])
    },
    // Graphics Cards
    {
      name: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER',
      slug: 'asus-tuf-gaming-rtx-4070-ti-super',
      description: 'Powerful graphics card for 1440p gaming with ray tracing and DLSS 3 support',
      shortDescription: 'Excellent 1440p gaming performance with DLSS 3',
      price: new Decimal(89999),
      salePrice: new Decimal(84999),
      stock: 8,
      sku: 'GPU-ASUS-4070TIS',
      categorySlug: 'graphics-cards-gpu',
      brandSlug: 'asus',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'GPU Chip': 'NVIDIA GeForce RTX 4070 Ti SUPER',
        'VRAM': '16GB',
        'VRAM Type': 'GDDR6X',
        'Base Clock': '2340 MHz',
        'Boost Clock': '2610 MHz',
        'Memory Clock': '21000 MHz',
        'Interface': 'PCIe 4.0 x16',
        'Power Connectors': '1x 12VHPWR (16-pin)',
        'TDP': '285W',
        'Ray Tracing': true,
        'DLSS/FSR': 'DLSS 3'
      }),
      images: JSON.stringify(['/products/gpu-asus-4070tis-1.jpg']),
      metaTitle: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER - High Performance GPU',
      metaDescription: 'ASUS TUF Gaming GeForce RTX 4070 Ti SUPER graphics card for high-performance gaming and content creation',
      tags: JSON.stringify(['gpu', 'graphics-card', 'asus', 'rtx-4070-ti'])
    },
    // Storage
    {
      name: 'Samsung 980 PRO 1TB NVMe SSD',
      slug: 'samsung-980-pro-1tb-nvme-ssd',
      description: 'High-performance PCIe 4.0 NVMe SSD with blazing fast speeds for gaming and professional workloads',
      shortDescription: 'Blazing fast PCIe 4.0 SSD with 7000MB/s speeds',
      price: new Decimal(12999),
      salePrice: new Decimal(11999),
      stock: 25,
      sku: 'SSD-SAM-980P-1TB',
      categorySlug: 'storage',
      brandSlug: 'samsung',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Capacity': '1TB',
        'Type': 'NVMe SSD',
        'Interface': 'M.2 NVMe',
        'Form Factor': 'M.2 2280',
        'Read Speed': '7000 MB/s',
        'Write Speed': '5000 MB/s',
        'NAND Type': 'TLC',
        'Cache': '1GB LPDDR4'
      }),
      images: JSON.stringify(['/products/ssd-samsung-980pro-1tb-1.jpg']),
      metaTitle: 'Samsung 980 PRO 1TB NVMe SSD - High Speed Storage',
      metaDescription: 'Samsung 980 PRO 1TB NVMe SSD for blazing fast storage performance in gaming and professional use',
      tags: JSON.stringify(['ssd', 'nvme', 'samsung', 'storage'])
    },
    // Power Supplies
    {
      name: 'Seasonic Focus GX-850 80+ Gold Modular PSU',
      slug: 'seasonic-focus-gx-850-gold-modular',
      description: 'Premium 850W modular power supply with 80+ Gold efficiency and 10-year warranty',
      shortDescription: 'Reliable 850W Gold rated modular PSU',
      price: new Decimal(16999),
      salePrice: new Decimal(15999),
      stock: 18,
      sku: 'PSU-SEA-GX850',
      categorySlug: 'power-supplies-psu',
      brandSlug: 'seasonic',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Wattage': '850W',
        'Efficiency': '80+ Gold',
        'Modular': 'Fully Modular',
        'Form Factor': 'ATX',
        'Fan Size': '120mm',
        'PCIe Connectors': '4x 8-pin',
        'SATA Connectors': '8x SATA'
      }),
      images: JSON.stringify(['/products/psu-seasonic-focus-gx850-1.jpg']),
      metaTitle: 'Seasonic Focus GX-850 80+ Gold Modular PSU - Reliable Power Supply',
      metaDescription: 'Seasonic Focus GX-850 80+ Gold Modular PSU for stable and efficient power delivery',
      tags: JSON.stringify(['psu', 'power-supply', 'seasonic', 'gold-rated'])
    },
    // Cases
    {
      name: 'Fractal Design Define 7 Compact',
      slug: 'fractal-design-define-7-compact',
      description: 'Premium mid-tower case with excellent build quality, airflow optimization, and noise dampening',
      shortDescription: 'Premium mid-tower with excellent airflow and build quality',
      price: new Decimal(19999),
      salePrice: new Decimal(18999),
      stock: 10,
      sku: 'CASE-FD-D7C',
      categorySlug: 'cases',
      brandSlug: 'fractal-design',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Form Factor': 'Mid Tower',
        'Motherboard Support': 'ATX, Micro-ATX, Mini-ITX',
        'GPU Clearance': '341mm',
        'CPU Cooler Clearance': '169mm',
        'Front Fans': '3x 120mm or 2x 140mm',
        'Top Fans': '2x 120mm or 2x 140mm',
        'Rear Fans': '1x 120mm (included)',
        'Side Panel': 'Tempered Glass',
        'Front I/O': '2x USB 3.0, 1x USB-C, Audio'
      }),
      images: JSON.stringify(['/products/case-fractal-design-define-7-compact-1.jpg']),
      metaTitle: 'Fractal Design Define 7 Compact - Premium PC Case',
      metaDescription: 'Fractal Design Define 7 Compact mid-tower case with excellent airflow and build quality',
      tags: JSON.stringify(['case', 'pc-case', 'fractal-design', 'define-7'])
    },
    // Cooling
    {
      name: 'Noctua NH-D15 CPU Cooler',
      slug: 'noctua-nh-d15-cpu-cooler',
      description: 'Premium dual-tower air cooler with exceptional cooling performance and ultra-quiet operation',
      shortDescription: 'World-class air cooler with dual fans',
      price: new Decimal(12999),
      stock: 20,
      sku: 'COOL-NOC-NHD15',
      categorySlug: 'cooling',
      brandSlug: 'noctua',
      isActive: true,
      isFeatured: true,
      specifications: JSON.stringify({
        'Type': 'Air Cooler',
        'Socket Support': 'LGA 1700, LGA 1200, AM5, AM4',
        'Fan Size': '140mm',
        'Height': '165mm',
        'TDP Rating': '220W+',
        'RPM Range': '300-1500 RPM',
        'Noise Level': '24.6 dBA',
        'RGB': false
      }),
      images: JSON.stringify(['/products/cpu-cooler-noctua-nh-d15-1.jpg']),
      metaTitle: 'Noctua NH-D15 CPU Cooler - Premium Air Cooler',
      metaDescription: 'Noctua NH-D15 CPU Cooler with dual towers and fans for exceptional cooling performance',
      tags: JSON.stringify(['cpu-cooler', 'air-cooler', 'noctua', 'nh-d15'])
    }
  ]

  const createdProducts = []
  for (const product of products) {
    const category = createdCategories.find(c => c.slug === product.categorySlug)
    const brand = createdBrands.find(b => b.slug === product.brandSlug)
    if (!category || !brand) {
      console.log(`⚠️  Skipping product ${product.name} - category or brand not found`)
      continue
    }
    const { categorySlug, brandSlug, ...productData } = product
    const created = await prisma.product.create({
      data: {
        ...productData,
        categoryId: category.id,
        brandId: brand.id,
      },
    })
    createdProducts.push(created)
    console.log('✅ Created product:', created.name)
  }

  // Create sample orders
  const orders = [
    {
      orderNumber: 'ORD-' + Date.now().toString().slice(-8) + '-001',
      customerName: 'Ahmed Khan',
      customerEmail: 'ahmed.khan@example.com',
      customerPhone: '+92300-1234567',
      shippingAddress: 'House 123, Block A, DHA Phase 5',
      shippingCity: 'Lahore',
      shippingState: 'Punjab',
      shippingZip: '54000',
      shippingCountry: 'Pakistan',
      billingAddress: 'House 123, Block A, DHA Phase 5',
      billingCity: 'Lahore',
      billingState: 'Punjab',
      billingZip: '54000',
      billingCountry: 'Pakistan',
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.WHATSAPP,
      totalAmount: new Decimal(157997),
      subtotal: new Decimal(149997),
      taxAmount: new Decimal(0),
      shippingAmount: new Decimal(8000),
      discountAmount: new Decimal(0),
      notes: 'High-end gaming build - handle with care',
    },
    {
      orderNumber: 'ORD-' + Date.now().toString().slice(-8) + '-002',
      customerName: 'Sara Ali',
      customerEmail: 'sara.ali@example.com',
      customerPhone: '+92321-9876543',
      shippingAddress: 'Flat 456, Gulshan-e-Iqbal',
      shippingCity: 'Karachi',
      shippingState: 'Sindh',
      shippingZip: '75300',
      shippingCountry: 'Pakistan',
      billingAddress: 'Flat 456, Gulshan-e-Iqbal',
      billingCity: 'Karachi',
      billingState: 'Sindh',
      billingZip: '75300',
      billingCountry: 'Pakistan',
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: PaymentMethod.WHATSAPP,
      totalAmount: new Decimal(74998),
      subtotal: new Decimal(67498),
      taxAmount: new Decimal(0),
      shippingAmount: new Decimal(7500),
      discountAmount: new Decimal(0),
      notes: 'Memory and storage upgrade'
    },
    {
      orderNumber: 'ORD-' + Date.now().toString().slice(-8) + '-003',
      customerName: 'Hassan Sheikh',
      customerEmail: 'hassan.sheikh@example.com',
      customerPhone: '+92333-5555555',
      shippingAddress: 'Plot 789, F-10 Markaz',
      shippingCity: 'Islamabad',
      shippingState: 'ICT',
      shippingZip: '44000',
      shippingCountry: 'Pakistan',
      billingAddress: 'Plot 789, F-10 Markaz',
      billingCity: 'Islamabad',
      billingState: 'ICT',
      billingZip: '44000',
      billingCountry: 'Pakistan',
      status: OrderStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.WHATSAPP,
      totalAmount: new Decimal(84999),
      subtotal: new Decimal(84999),
      taxAmount: new Decimal(0),
      shippingAmount: new Decimal(0),
      discountAmount: new Decimal(0),
      notes: 'Graphics card upgrade for gaming'
    }
  ]

  const createdOrders = []
  for (const order of orders) {
    const created = await prisma.order.create({
      data: order,
    })
    createdOrders.push(created)
    console.log('✅ Created order:', created.orderNumber)
  }

  // Create order items
  const orderItems = [
    {
      orderId: createdOrders[0].id,
      productId: createdProducts.find(p => p.sku === 'CPU-INT-13700K')?.id!,
      quantity: 1,
      unitPrice: new Decimal(49999),
      totalPrice: new Decimal(49999),
    },
    {
      orderId: createdOrders[0].id,
      productId: createdProducts.find(p => p.sku === 'GPU-ASUS-4070TIS')?.id!,
      quantity: 1,
      unitPrice: new Decimal(84999),
      totalPrice: new Decimal(84999),
    },
    {
      orderId: createdOrders[0].id,
      productId: createdProducts.find(p => p.sku === 'PSU-SEA-GX850')?.id!,
      quantity: 1,
      unitPrice: new Decimal(15999),
      totalPrice: new Decimal(15999),
    },
    {
      orderId: createdOrders[1].id,
      productId: createdProducts.find(p => p.sku === 'RAM-GSK-TZ5-32GB')?.id!,
      quantity: 2,
      unitPrice: new Decimal(17499),
      totalPrice: new Decimal(34998),
    },
    {
      orderId: createdOrders[1].id,
      productId: createdProducts.find(p => p.sku === 'SSD-SAM-980P-1TB')?.id!,
      quantity: 2,
      unitPrice: new Decimal(11999),
      totalPrice: new Decimal(23998),
    },
    {
      orderId: createdOrders[1].id,
      productId: createdProducts.find(p => p.sku === 'RAM-COR-VLPX-16GB')?.id!,
      quantity: 1,
      unitPrice: new Decimal(7499),
      totalPrice: new Decimal(7499),
    },
    {
      orderId: createdOrders[2].id,
      productId: createdProducts.find(p => p.sku === 'GPU-ASUS-4070TIS')?.id!,
      quantity: 1,
      unitPrice: new Decimal(84999),
      totalPrice: new Decimal(84999),
    }
  ]

  for (const item of orderItems) {
    await prisma.orderItem.create({
      data: item,
    })
  }

  console.log('✅ Created order items')

  // Create PC builds
  const builds = [
    {
      name: 'Gaming Beast 2024',
      description: 'High-end gaming PC for 4K gaming and streaming',
      totalPrice: new Decimal(350000),
      isPublic: true,
      isTemplate: false,
      components: [
        { productSku: 'CPU-INT-13700K', quantity: 1, componentType: ComponentType.CPU },
        { productSku: 'MB-ASUS-Z790E', quantity: 1, componentType: ComponentType.MOTHERBOARD },
        { productSku: 'RAM-GSK-TZ5-32GB', quantity: 1, componentType: ComponentType.RAM },
        { productSku: 'GPU-ASUS-4070TIS', quantity: 1, componentType: ComponentType.GPU },
        { productSku: 'SSD-SAM-980P-1TB', quantity: 1, componentType: ComponentType.STORAGE_PRIMARY },
        { productSku: 'PSU-SEA-GX850', quantity: 1, componentType: ComponentType.PSU },
        { productSku: 'CASE-FD-D7C', quantity: 1, componentType: ComponentType.CASE },
        { productSku: 'COOL-NOC-NHD15', quantity: 1, componentType: ComponentType.CPU_COOLER },
      ]
    },
    {
      name: 'Content Creator Pro',
      description: 'Powerful PC build for content creation and productivity',
      totalPrice: new Decimal(300000),
      isPublic: true,
      isTemplate: false,
      components: [
        { productSku: 'CPU-AMD-7800X3D', quantity: 1, componentType: ComponentType.CPU },
        { productSku: 'GPU-NVIDIA-RTX4080', quantity: 1, componentType: ComponentType.GPU },
        { productSku: 'MB-MSI-B650TOM', quantity: 1, componentType: ComponentType.MOTHERBOARD },
        { productSku: 'RAM-COR-VLPX-16GB', quantity: 2, componentType: ComponentType.RAM },
        { productSku: 'SSD-SAM-980P-1TB', quantity: 1, componentType: ComponentType.STORAGE_PRIMARY },
        { productSku: 'PSU-SEA-GX850', quantity: 1, componentType: ComponentType.PSU },
        { productSku: 'CASE-FD-D7C', quantity: 1, componentType: ComponentType.CASE },
        { productSku: 'COOL-NOC-NHD15', quantity: 1, componentType: ComponentType.CPU_COOLER },
      ]
    }
  ]
  for (const build of builds) {
    const createdBuild = await prisma.pCBuild.create({
      data: {
        name: build.name,
        description: build.description,
        totalPrice: build.totalPrice,
        isPublic: build.isPublic,
        isTemplate: build.isTemplate,
      }
    })
    for (const comp of build.components) {
      const product = createdProducts.find(p => p.sku === comp.productSku)
      if (product) {
        await prisma.buildComponent.create({
          data: {
            buildId: createdBuild.id,
            productId: product.id,
            quantity: comp.quantity,
            componentType: comp.componentType
          }
        })
      }
    }
    console.log('✅ Created PC build:', createdBuild.name)
  }

  // Create site settings
  const siteSettings = [
    {
      key: 'site_name',
      value: 'PC Wala Online',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Website name',
      isPublic: true,
    },
    {
      key: 'site_description',
      value: 'Your Premier PC Hardware Store in Pakistan',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Website description',
      isPublic: true,
    },
    {
      key: 'contact_email',
      value: 'info@pcwalaonline.com',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Contact email',
      isPublic: true,
    },
    {
      key: 'contact_phone',
      value: '+92300-1234567',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Contact phone number',
      isPublic: true,
    },
    {
      key: 'whatsapp_number',
      value: '+92300-1234567',
      type: SettingType.TEXT,
      category: 'general',
      description: 'WhatsApp contact number',
      isPublic: true,
    },
    {
      key: 'address',
      value: 'Lahore, Punjab, Pakistan',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Physical address',
      isPublic: true,
    },
    {
      key: 'currency',
      value: 'PKR',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Currency code',
      isPublic: true,
    },
    {
      key: 'currency_symbol',
      value: 'Rs.',
      type: SettingType.TEXT,
      category: 'general',
      description: 'Currency symbol',
      isPublic: true,
    },
    {
      key: 'tax_rate',
      value: '0.0',
      type: SettingType.NUMBER,
      category: 'general',
      description: 'Tax rate',
      isPublic: true,
    },
    {
      key: 'shipping_fee',
      value: '500',
      type: SettingType.NUMBER,
      category: 'general',
      description: 'Flat shipping fee',
      isPublic: true,
    },
    {
      key: 'free_shipping_threshold',
      value: '50000',
      type: SettingType.NUMBER,
      category: 'general',
      description: 'Free shipping threshold',
      isPublic: true,
    },
    {
      key: 'facebook_link',
      value: 'https://facebook.com/pcwalaonline',
      type: SettingType.TEXT,
      category: 'social',
      description: 'Facebook page URL',
      isPublic: true,
    },
    {
      key: 'instagram_link',
      value: 'https://instagram.com/pcwalaonline',
      type: SettingType.TEXT,
      category: 'social',
      description: 'Instagram profile URL',
      isPublic: true,
    },
    {
      key: 'youtube_link',
      value: 'https://youtube.com/pcwalaonline',
      type: SettingType.TEXT,
      category: 'social',
      description: 'YouTube channel URL',
      isPublic: true,
    },
    {
      key: 'tiktok_link',
      value: 'https://tiktok.com/@pcwalaonline',
      type: SettingType.TEXT,
      category: 'social',
      description: 'TikTok profile URL',
      isPublic: true,
    },
    {
      key: 'meta_title',
      value: 'PC Wala Online - Premium PC Components & Gaming Hardware',
      type: SettingType.TEXT,
      category: 'seo',
      description: 'Meta title for SEO',
      isPublic: true,
    },
    {
      key: 'meta_description',
      value: 'Shop the latest PC components, gaming hardware, and custom PC builds in Pakistan. Best prices on CPUs, GPUs, motherboards, and more.',
      type: SettingType.TEXT,
      category: 'seo',
      description: 'Meta description for SEO',
      isPublic: true,
    },
    {
      key: 'meta_keywords',
      value: 'PC components, gaming hardware, custom PC builds, CPU, GPU, motherboard, RAM, SSD, Pakistan',
      type: SettingType.TEXT,
      category: 'seo',
      description: 'Meta keywords for SEO',
      isPublic: true,
    }
  ]
  for (const setting of siteSettings) {
    const createdSetting = await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
    console.log('✅ Created site setting:', createdSetting.key)
  }

  console.log('')
  console.log('🎉 Database seeding completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`   • Products: ${createdProducts.length}`)
  console.log(`   • Orders: ${createdOrders.length}`)
  console.log('')
  console.log('💡 Test the dynamic specifications by editing any product!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Database seed failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
