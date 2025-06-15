'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function BottomBar() {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  return (
    <>
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={() => setShowMobileSearch(false)}>
          <div className="absolute bottom-20 left-0 right-0 p-4" onClick={e => e.stopPropagation()}>
            <form className="flex items-center border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-lg">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                placeholder="Search products..."
                className="bg-transparent outline-none ml-3 flex-1 text-sm"
                autoFocus
              />
              <button type="submit" className="ml-2 text-blue-600 font-medium">
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
        <div className="flex items-center justify-around py-2">
          
          {/* Home */}
          <Link 
            href="/" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            <span className="text-xs mt-1">Home</span>
          </Link>

          {/* PC Builder */}
          <Link 
            href="/build" 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M7 15h10M7 11h4"/>
              <circle cx="17" cy="8" r="1"/>
            </svg>
            <span className="text-xs mt-1">Builder</span>
          </Link>

          {/* Search */}
          <button 
            onClick={() => setShowMobileSearch(true)}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="text-xs mt-1">Search</span>
          </button>

          {/* Contact */}
          <Link 
            href="https://wa.me/1234567890" 
            target="_blank"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-green-600 transition-colors"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-green-600">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span className="text-xs mt-1 text-green-600">Contact</span>
          </Link>

        </div>
      </div>

      {/* Bottom padding for content to not be hidden behind the bottom bar on mobile */}
      <div className="h-16 md:hidden"></div>
    </>
  )
}
