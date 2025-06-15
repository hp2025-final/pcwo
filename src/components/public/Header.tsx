'use client'

import Link from 'next/link'
import { useState } from 'react'
import { colors } from '@/lib/colors'

export default function Header() {
  const [search, setSearch] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="max-w-full px-4 lg:px-6">
        
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between h-20">
          {/* Left: Menu */}
          <div className="flex-1">
            <nav className="flex items-center space-x-8">
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Components</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Gaming PCs</Link>
              <Link href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Accessories</Link>
              <Link href="#" className="text-blue-600 font-semibold hover:underline">PC Builder</Link>
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="block">
              <div 
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold flex items-center justify-center rounded-lg shadow-lg"
                style={{ 
                  height: '120px', 
                  width: '250px',
                  background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})`
                }}
              >
                PCW-V3
              </div>
            </Link>
          </div>

          {/* Right: Search, Cart, WhatsApp */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            <form className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus-within:border-blue-500 transition-all">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none ml-2 w-48 text-sm"
              />
            </form>
            
            <Link href="#" className="p-3 rounded-lg hover:bg-gray-100 transition-colors relative" aria-label="Cart">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </Link>

            <Link 
              href="https://wa.me/1234567890" 
              target="_blank"
              className="p-3 rounded-lg hover:bg-green-100 transition-colors" 
              aria-label="WhatsApp"
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="text-green-600">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </Link>
          </div>
        </div>        {/* Tablet Layout */}
        <div className="hidden md:flex lg:hidden items-center justify-between h-16">
          {/* Left: Hamburger Menu */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <div 
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold flex items-center justify-center rounded-lg shadow-lg"
                style={{ 
                  height: '90px', 
                  width: '187px',
                  background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})`
                }}
              >
                PCW-V3
              </div>
            </Link>
          </div>

          {/* Right: Search Icon, Cart */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            
            <Link href="#" className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" aria-label="Cart">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden items-center justify-between h-14">
          {/* Left: Hamburger Menu */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link href="/">
              <div 
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white font-bold flex items-center justify-center rounded-lg shadow-lg text-sm"
                style={{ 
                  height: '60px', 
                  width: '125px',
                  background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})`
                }}
              >
                PCW-V3
              </div>
            </Link>
          </div>

          {/* Right: Search Icon, Cart */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            
            <Link href="#" className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative" aria-label="Cart">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6"/>
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center text-xs">0</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-3">
            <form className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none ml-2 flex-1 text-sm"
              />
            </form>
          </div>
        )}

        {/* Tablet Search Bar */}
        {showMobileSearch && (
          <div className="hidden md:block lg:hidden px-4 pb-3">
            <form className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-50">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none ml-2 flex-1 text-sm"
              />
            </form>
          </div>
        )}        {/* Mobile Menu Overlay */}
        {showMobileMenu && (
          <div className="lg:hidden fixed inset-0 top-14 md:top-16 bg-black bg-opacity-50 z-50" onClick={() => setShowMobileMenu(false)}>
            <div className="bg-white w-64 h-full shadow-xl" onClick={e => e.stopPropagation()}>
              <nav className="p-4 space-y-4">
                <Link href="#" className="block text-gray-700 hover:text-blue-600 font-medium py-2 border-b border-gray-100">Components</Link>
                <Link href="#" className="block text-gray-700 hover:text-blue-600 font-medium py-2 border-b border-gray-100">Gaming PCs</Link>
                <Link href="#" className="block text-gray-700 hover:text-blue-600 font-medium py-2 border-b border-gray-100">Accessories</Link>
                <Link href="#" className="block text-blue-600 font-semibold py-2 border-b border-gray-100">PC Builder</Link>
                
                {/* Separator */}
                <div className="border-t border-gray-200 my-4"></div>
                
                {/* WhatsApp Contact */}
                <Link 
                  href="https://wa.me/1234567890" 
                  target="_blank"
                  className="flex items-center space-x-3 text-green-600 hover:text-green-700 font-medium py-2"
                >
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  <span>+1 (234) 567-8900</span>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
