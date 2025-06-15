import React from 'react'

interface MenuProps {
  handle?: string
  renderMode?: string
  className?: string
  itemClassName?: string
}

export default function Menu({ className = '' }: MenuProps) {
  // Placeholder menu component
  const menuItems = [
    { id: '1', name: 'Components', href: '/category/components' },
    { id: '2', name: 'Gaming PCs', href: '/category/gaming-pcs' },
    { id: '3', name: 'Accessories', href: '/category/accessories' },
    { id: '4', name: 'PC Builder', href: '/build' },
  ]

  return (
    <nav className={`menu ${className}`}>
      <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6">
        {menuItems.map(item => (
          <li key={item.id}>
            <a 
              href={item.href}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              {item.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
