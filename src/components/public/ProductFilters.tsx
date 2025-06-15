'use client'

import { useState } from 'react'

interface FilterState {
  category: string
  brand: string
  priceRange: [number, number]
  sortBy: string
  inStock: boolean
}

interface ProductFiltersProps {
  onFiltersChange?: (filters: FilterState) => void
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    brand: '',
    priceRange: [0, 200000],
    sortBy: 'name',
    inStock: false
  })

  const categories = [
    'Processors',
    'Graphics Cards',
    'Memory',
    'Storage',
    'Motherboards',
    'Power Supplies',
    'Cases',
    'Cooling',
    'Accessories'
  ]

  const brands = [
    'Intel',
    'AMD',
    'NVIDIA',
    'Corsair',
    'ASUS',
    'MSI',
    'Gigabyte',
    'Cooler Master',
    'Thermaltake'
  ]

  const handleFilterChange = (key: keyof FilterState, value: string | [number, number] | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => handleFilterChange('brand', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="200000"
            step="1000"
            value={filters.priceRange[1]}
            onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Rs. 0</span>
            <span>Rs. {filters.priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="name">Name (A-Z)</option>
          <option value="price-low">Price (Low to High)</option>
          <option value="price-high">Price (High to Low)</option>
          <option value="newest">Newest First</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* In Stock Only */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          const resetFilters = {
            category: '',
            brand: '',
            priceRange: [0, 200000] as [number, number],
            sortBy: 'name',
            inStock: false
          }
          setFilters(resetFilters)
          onFiltersChange?.(resetFilters)
        }}
        className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  )
}
