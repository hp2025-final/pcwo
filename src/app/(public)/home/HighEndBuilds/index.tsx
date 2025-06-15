import React from 'react'
import Image from 'next/image'
import { colors } from '@/lib/colors'

const highEndBuilds = [
  {
    id: 1,
    name: 'Intel Ultra 9 Z890 PC Builder',
    image: '/uploads/products/Custom Build PC.webp',
    os: 'Windows 11 Home (64-bit Edition)',
    cpu: 'Intel® Core™ Ultra 9 285K',
    gpu: 'GeForce RTX 5070 Ti 16GB',
    ram: '32GB DDR5 5200mhz Memory',
    motherboard: 'MSI PRO Z890-S WIFI ATX Motherboard',
    storage: '2TB Samsung 990 EVO Plus PCIe NVMe SSD',
    reviews: 7,
    rating: 5,
    originalPrice: 'PKR 2,89,900',
    price: 'PKR 2,27,800',
    delivery: 'Free UK Delivery',
    finance: 'Finance Available',
    dispatch: 'Wednesday, 25/6/2025'
  },
  {
    id: 2,
    name: 'Infinity U7 SUPER Next Day PC SY1889',
    image: '/uploads/products/Custom Build PC.webp',
    os: 'Windows 11 Home (64-bit Edition)',
    cpu: 'Intel® Core™ Ultra 7 265KF',
    gpu: 'NVIDIA RTX 4070 SUPER 12GB',
    ram: '32GB DDR5 5200mhz Memory',
    motherboard: 'MSI PRO Z890-S WIFI ATX Motherboard',
    storage: '2TB WD Blue SN580 NVMe PCIe Gen4 SSD',
    reviews: 0,
    rating: 0,
    price: 'PKR 1,49,800',
    delivery: 'Next Day Delivery',
    finance: 'Finance Available',
    dispatch: 'Monday, 16/6/2025'
  },
  {
    id: 3,
    name: 'Ultra R77 Elite Gaming PC',
    image: '/uploads/products/Custom Build PC.webp',
    os: 'Windows 11 Home (64-bit Edition)',
    cpu: 'AMD Ryzen™ 7 9800X3D',
    gpu: 'Radeon™ RX 9070 XT 16GB',
    ram: '32GB DDR5 5200mhz Memory',
    motherboard: 'MSI PRO B650-S WIFI ATX Motherboard',
    storage: '2TB WD Green SN3000 NVMe PCIe SSD',
    reviews: 107,
    rating: 5,
    originalPrice: 'PKR 2,39,900',
    price: 'PKR 1,95,960',
    discount: '£89 Off',
    delivery: 'Free UK Delivery',
    finance: 'Finance Available',
    dispatch: 'Wednesday, 25/6/2025'
  }
]

export default function HighEndBuilds() {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-green-500' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="w-full bg-gray-50 text-black py-8">
      {/* Desktop Layout - Shows all 3 products */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-roboto text-xl sm:text-2xl font-bold">High End Builds</h2>
            <a 
              href="#"
              className="flex items-center gap-2 text-white px-4 py-2 rounded font-semibold shadow-lg"
              style={{ backgroundColor: colors.blue }}
            >
              <span>View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {highEndBuilds.map(build => (
              <div key={build.id} className="flex flex-col">
                <a href="#" className="bg-white border border-gray-200 p-6 shadow-sm flex-shrink-0 flex flex-col h-full">
                  <div className="relative w-full aspect-square mb-6 overflow-hidden bg-gray-100">
                    <Image
                      src={build.image}
                      alt={build.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-3 text-gray-800">{build.name}</h3>
                    
                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                      <div>{build.os}</div>
                      <div className="text-blue-600">{build.cpu}</div>
                      <div className="text-blue-600">{build.gpu}</div>
                      <div>{build.ram}</div>
                      <div>{build.motherboard}</div>
                      <div>{build.storage}</div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">{renderStars(build.rating)}</div>
                      <span className="text-sm text-blue-600">
                        {build.reviews > 0 ? `${build.reviews} Reviews` : '0 Review'}
                      </span>
                    </div>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      {build.discount && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 text-xs border border-red-200">
                          {build.discount}
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs border border-gray-200">
                        {build.delivery}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div 
                        className="text-white font-bold text-center py-3 mb-3 text-sm"
                        style={{ backgroundColor: colors.red }}
                      >
                        Shop
                      </div>
                      
                      <div className="text-center">
                        {build.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">{build.originalPrice}</div>
                        )}
                        <div className="text-xl font-bold text-green-600">{build.price}</div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Layout - Horizontal Scroll */}
      <div className="lg:hidden w-full px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-roboto text-xl sm:text-2xl font-bold">High End Builds</h2>
          <a 
            href="#"
            className="flex items-center gap-2 text-white px-4 py-2 rounded font-semibold shadow-lg"
            style={{ backgroundColor: colors.blue }}
          >
            <span>View All</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {highEndBuilds.map(build => (
              <div
                key={build.id}
                className="min-w-[calc((100vw-64px)/1.5)] sm:min-w-[calc((100vw-64px)/2)] flex-shrink-0"
              >
                <a href="#" className="block bg-white border border-gray-200 p-4 shadow-sm h-full">
                  <div className="relative w-full aspect-square mb-4 overflow-hidden bg-gray-100">
                    <Image
                      src={build.image}
                      alt={build.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-base font-bold mb-2 text-gray-800">{build.name}</h3>
                    
                    <div className="text-xs text-gray-600 mb-3 space-y-1">
                      <div>{build.os}</div>
                      <div className="text-blue-600">{build.cpu}</div>
                      <div className="text-blue-600">{build.gpu}</div>
                      <div>{build.ram}</div>
                      <div>{build.motherboard}</div>
                      <div>{build.storage}</div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">{renderStars(build.rating)}</div>
                      <span className="text-xs text-blue-600">
                        {build.reviews > 0 ? `${build.reviews} Reviews` : '0 Review'}
                      </span>
                    </div>

                    <div className="flex gap-2 mb-3 flex-wrap">
                      {build.discount && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 text-xs border border-red-200">
                          {build.discount}
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 text-xs border border-gray-200">
                        {build.delivery}
                      </span>
                    </div>

                    <div 
                      className="text-white font-bold text-center py-2 mb-2 text-sm"
                      style={{ backgroundColor: colors.red }}
                    >
                      Shop
                    </div>
                    
                    <div className="text-center">
                      {build.originalPrice && (
                        <div className="text-xs text-gray-500 line-through">{build.originalPrice}</div>
                      )}
                      <div className="text-lg font-bold text-green-600">{build.price}</div>
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