import React from 'react'
import Image from 'next/image'

const categories = [
  { 
    id: 'gaming-pcs',
    name: 'Gaming PCs', 
    image: '/uploads/products/Custom Build PC.webp',
    href: '#',
    description: 'High-performance gaming systems'
  },
  { 
    id: 'branded-pcs',
    name: 'Branded PCs', 
    image: '/uploads/products/Branded PC.png',
    href: '#',
    description: 'Reliable branded computers'
  },
  { 
    id: 'laptops',
    name: 'Laptops', 
    image: '/uploads/products/Laptop.jpg',
    href: '#',
    description: 'Portable computing power'
  },
  { 
    id: 'tablets',
    name: 'Tablets', 
    image: '/uploads/products/tablet.jpg',
    href: '#',
    description: 'Touch-enabled devices'
  },
  { 
    id: 'graphics-cards',
    name: 'Graphics Cards', 
    image: '/uploads/products/gpu.jpg',
    href: '#',
    description: 'High-end GPUs for gaming'
  },
  { 
    id: 'processors',
    name: 'Processors', 
    image: '/uploads/products/processor.jpg',
    href: '#',
    description: 'Latest CPUs for performance'
  },
  { 
    id: 'motherboards',
    name: 'Motherboards', 
    image: '/uploads/products/motherboard.png',
    href: '#',
    description: 'Core system boards'
  },
  { 
    id: 'memory',
    name: 'Memory (RAM)', 
    image: '/uploads/products/RAM.jpg',
    href: '#',
    description: 'High-speed system memory'
  },
  { 
    id: 'storage',
    name: 'Storage', 
    image: '/uploads/products/ssd.jpg',
    href: '#',
    description: 'SSDs and storage solutions'
  },
  { 
    id: 'power-supplies',
    name: 'Power Supplies', 
    image: '/uploads/products/psu.jpg',
    href: '#',
    description: 'Reliable PSUs for your build'
  },
  { 
    id: 'cooling',
    name: 'Cooling', 
    image: '/uploads/products/fan.jpg',
    href: '#',
    description: 'Keep your system cool'
  },
  { 
    id: 'cases',
    name: 'Cases', 
    image: '/uploads/products/casing.jpg',
    href: '#',
    description: 'Stylish PC enclosures'
  },
  { 
    id: 'keyboards',
    name: 'Keyboards', 
    image: '/uploads/products/keyboard.png',
    href: '#',
    description: 'Mechanical and gaming keyboards'
  },
  { 
    id: 'mice',
    name: 'Gaming Mice', 
    image: '/uploads/products/mouse.jpg',
    href: '#',
    description: 'Precision gaming mice'
  },
  { 
    id: 'printers',
    name: 'Printers', 
    image: '/uploads/products/printer.png',
    href: '#',
    description: 'Home and office printing'
  }
]

export default function CategoryShowcase() {
  return (
    <section className="w-full bg-white text-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-roboto text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Discover our comprehensive range of PC hardware and accessories for every need
          </p>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="block sm:hidden">
          <div 
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-shrink-0 w-48 group"
                style={{ scrollSnapAlign: 'start' }}
              >
                <a
                  href={category.href}
                  className="block h-56 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-300"
                >
                  <div className="relative w-full h-32 mb-3 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="192px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      priority={false}
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <h3 className="font-inter font-semibold text-sm text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-4 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Tablet: 3x5 Grid */}
        <div className="hidden sm:grid lg:hidden grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <a
                href={category.href}
                className="block h-72 bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-300"
              >
                <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 33vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    priority={false}
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <h3 className="font-inter font-semibold text-base text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-5 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Desktop: 5x3 Grid */}
        <div className="hidden lg:grid grid-cols-5 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group">
              <a
                href={category.href}
                className="block h-80 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-300"
              >
                <div className="relative w-full h-48 mb-5 overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(min-width: 1024px) 20vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    priority={false}
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <h3 className="font-inter font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-6 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
