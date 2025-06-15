import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected items and proceed to checkout',
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600">
                PC Wala Online
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link href="/categories" className="text-gray-600 hover:text-gray-900">Categories</Link>
              <Link href="/build" className="text-gray-600 hover:text-gray-900">PC Builder</Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-900 font-medium">Cart</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Cart Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {/* Empty Cart */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <div className="space-x-4">
            <a 
              href="/products" 
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block font-medium"
            >
              Shop Products
            </a>
            <a 
              href="/build" 
              className="bg-white text-blue-600 px-6 py-3 rounded-md border-2 border-blue-600 hover:bg-blue-50 inline-block font-medium"
            >
              Build PC
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
