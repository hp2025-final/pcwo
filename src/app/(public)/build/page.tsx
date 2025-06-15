import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PC Builder',
  description: 'Build your custom PC with compatibility checks',
}

export default function BuildPage() {
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
              <Link href="/build" className="text-gray-600 hover:text-gray-900 font-medium">PC Builder</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* PC Builder Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PC Builder</h1>
          <p className="text-xl text-gray-600">Build your custom PC with automatic compatibility checking</p>
        </div>

        {/* Builder Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Build Components</h2>
            
            {/* Component Categories */}
            <div className="space-y-4">
              {['CPU', 'Motherboard', 'RAM', 'GPU', 'Storage', 'PSU', 'Case', 'Cooling'].map((component) => (
                <div key={component} className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-900">{component}</h3>
                    <p className="text-sm text-gray-500">No component selected</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm">
                    Select
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Build Summary</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start Building</h3>
              <p className="text-gray-500 mb-4">Select components to see your build summary and total price</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">PKR 0</span>
              </div>
              <button 
                disabled 
                className="w-full bg-gray-300 text-gray-500 px-6 py-3 rounded-md cursor-not-allowed"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
