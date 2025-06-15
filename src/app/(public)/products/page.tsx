import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ProductsListing } from '@/components/public/ProductsListing'
import { ProductFilters } from '@/components/public/ProductFilters'

export const metadata: Metadata = {
  title: 'All Products - PC Wala Online',
  description: 'Browse our complete collection of PC hardware components, gaming gear, and accessories.',
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our complete collection of high-quality PC hardware and components
          </p>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">Products</span>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <Suspense fallback={<div className="animate-pulse bg-white rounded-lg h-96"></div>}>
              <ProductFilters />
            </Suspense>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <Suspense fallback={<div className="animate-pulse bg-white rounded-lg h-96"></div>}>
              <ProductsListing />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
