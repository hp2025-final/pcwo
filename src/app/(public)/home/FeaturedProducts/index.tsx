import React from 'react'
import Image from 'next/image'
import { colors } from '@/lib/colors'

const products = [
  { id: 1, name: 'RTX 4090 GPU', price: '$1,999', image: '/uploads/products/i1.jpg' },
  { id: 2, name: 'Intel i9 14900K', price: '$599', image: '/uploads/products/i2.jpg' },
  { id: 3, name: 'Corsair DDR5 32GB', price: '$199', image: '/uploads/products/i3.jpg' },
  { id: 4, name: 'Samsung 990 Pro SSD', price: '$249', image: '/uploads/products/i4.webp' },
  { id: 5, name: 'NZXT H9 Elite Case', price: '$249', image: '/uploads/products/i1.jpg' },
  { id: 6, name: 'ASUS ROG Motherboard', price: '$399', image: '/uploads/products/i2.jpg' },
]

export default function FeaturedProducts() {
  return (
    <section className="w-full bg-white text-black py-8">
      <div className="w-full px-1 sm:px-2 md:px-3 lg:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 px-1 sm:px-2 md:px-3 lg:px-4">
          <h2 className="font-roboto text-xl sm:text-2xl font-bold">Featured Hardware</h2>
          <a 
            href="#"
            className="group flex items-center gap-2 text-white px-4 py-2 rounded font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:opacity-90"
            style={{ backgroundColor: colors.blue }}
          >
            <span>View All</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
        
        {/* Desktop: Grid Layout (6 products) */}
        <div className="hidden xl:grid xl:grid-cols-6 xl:gap-6 xl:px-4">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              <a href="#" className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-300 flex-shrink-0 flex flex-col h-full relative group">
                {/* HOT Badge on card */}
                <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                  HOT
                </div>
                <div className="relative w-full aspect-square mb-4 overflow-hidden bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div className="grid grid-cols-2 grid-rows-2 gap-1">
                    {/* Row 1: Full Width Product Title */}
                    <div 
                      className="text-white px-2 py-1 text-xs font-semibold transition-colors duration-300 text-left hover:opacity-90 col-span-2"
                      style={{ backgroundColor: colors.blue }}
                    >
                      {product.name}
                    </div>
                    {/* Row 2, Column 1: Shop Now (50%) */}
                    <div 
                      className="text-white font-semibold text-xs px-2 py-1 transition-colors duration-300 hover:opacity-90 flex items-center justify-center"
                      style={{ backgroundColor: colors.red }}
                    >
                      Shop Now
                    </div>
                    {/* Row 2, Column 2: Product Price (50%) */}
                    <div className="bg-white text-black px-2 py-1 text-xs font-bold shadow-sm border border-gray-200 flex items-center justify-center">
                      {product.price.replace(/[$,]/g, '')}
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Tablet & Mobile: Horizontal Scroll Layout */}
        <div className="xl:hidden overflow-x-auto px-1 sm:px-2 md:px-3 lg:px-4">
          <div className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-4 pt-2">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col min-w-[calc((100vw-32px)/1.7)] sm:min-w-[calc((100vw-64px)/3.5)] flex-shrink-0"
              >
                <a href="#" className="bg-white border border-gray-200 p-4 shadow-sm hover:shadow-lg hover:scale-105 hover:border-blue-300 transition-all duration-300 flex-shrink-0 flex flex-col h-full relative group">
                  {/* HOT Badge on card */}
                  <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                    HOT
                  </div>
                  <div className="relative w-full aspect-square mb-4 overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between">
                    <div className="grid grid-cols-2 grid-rows-2 gap-1">
                      {/* Row 1: Full Width Product Title */}
                      <div 
                        className="text-white px-2 py-1 text-xs font-semibold transition-colors duration-300 text-left hover:opacity-90 col-span-2"
                        style={{ backgroundColor: colors.blue }}
                      >
                        {product.name}
                      </div>
                      {/* Row 2, Column 1: Shop Now (50%) */}
                      <div 
                        className="text-white font-semibold text-xs px-2 py-1 transition-colors duration-300 hover:opacity-90 flex items-center justify-center"
                        style={{ backgroundColor: colors.red }}
                      >
                        Shop Now
                      </div>
                      {/* Row 2, Column 2: Product Price (50%) */}
                      <div className="bg-white text-black px-2 py-1 text-xs font-bold shadow-sm border border-gray-200 flex items-center justify-center">
                        {product.price.replace(/[$,]/g, '')}
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}