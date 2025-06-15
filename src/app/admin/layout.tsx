import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: {
    template: '%s | Admin - PC Wala Online',
    default: 'Admin Panel - PC Wala Online',
  },
  description: 'Admin panel for managing PC Wala Online store',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar will be added in Phase B */}
        <aside className="w-64 bg-gray-800 text-white">
          <div className="p-4">
            <h2 className="text-xl font-bold">Admin Panel</h2>          </div>          <nav className="mt-8">
            <Link href="/admin/dashboard" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Dashboard</Link>
            <Link href="/admin/products" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Products</Link>
            <Link href="/admin/categories" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Categories</Link>
            <Link href="/admin/shops" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Shops</Link>
            <Link href="/admin/brands" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Brands</Link>
            <Link href="/admin/menus" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Menus</Link>
            <Link href="/admin/orders" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Orders</Link>
            <Link href="/admin/settings" className="block px-4 py-2 text-gray-300 hover:bg-gray-700">Settings</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
