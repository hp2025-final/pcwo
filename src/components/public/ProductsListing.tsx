'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  brand: string
  inStock: boolean
}

interface ProductsListingProps {
  filters?: {
    category?: string
    brand?: string
    priceRange?: [number, number]
    sortBy?: string
  }
}

export function ProductsListing({}: ProductsListingProps) {
  // Mock product data (filters will be implemented later)
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Intel Core i7-12700K',
      price: 45000,
      image: '/uploads/products/processor.jpg',
      category: 'Processors',
      brand: 'Intel',
      inStock: true
    },
    {
      id: '2',
      name: 'NVIDIA RTX 4070',
      price: 85000,
      image: '/uploads/products/gpu.jpg',
      category: 'Graphics Cards',
      brand: 'NVIDIA',
      inStock: true
    },
    {
      id: '3',
      name: 'Corsair 16GB DDR4',
      price: 12000,
      image: '/uploads/products/RAM.jpg',
      category: 'Memory',
      brand: 'Corsair',
      inStock: false
    },
    // Add more mock products as needed
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-gray-100 relative">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.brand} • {product.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-blue-600">
                Rs. {product.price.toLocaleString()}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                product.inStock 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            <button 
              className={`w-full mt-3 py-2 rounded-lg font-medium transition-colors ${
                product.inStock
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
