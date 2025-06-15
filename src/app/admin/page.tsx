import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Admin Portal',
  description: 'Access the admin dashboard to manage your store',
}

export default function AdminPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="text-blue-500 text-6xl mb-6">👑</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Admin Portal
        </h1>
        <p className="text-gray-600 mb-8">
          Manage your PC Wala Online store with powerful admin tools.
        </p>
        <div className="space-y-4">
          <Link
            href="/admin/login"
            className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Admin Login
          </Link>
          <Link
            href="/admin/dashboard"
            className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="block w-full text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}
