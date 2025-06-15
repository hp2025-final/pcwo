import React from 'react'
import { colors } from '@/lib/colors'

const reasons = [
  {
    icon: (
      // Truck SVG
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h3.17a2 2 0 0 1 1.6.8l2.72 3.63A2 2 0 0 1 23 14.2V16a2 2 0 0 1-2 2h-1"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Lightning Fast Shipping',
    desc: 'Same-day dispatch on top products with express delivery options.',
    highlight: 'Same Day'
  },
  {
    icon: (
      // Headset SVG
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18v-6a8 8 0 0 1 16 0v6"/>
        <rect x="2" y="18" width="4" height="4" rx="1"/>
        <rect x="18" y="18" width="4" height="4" rx="1"/>
      </svg>
    ),
    title: 'Expert Pro Support',
    desc: '24/7 technical support from gaming and PC building specialists.',
    highlight: '24/7 Support'
  },
  {
    icon: (
      // Shield with checkmark SVG
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 11.6V12a9 9 0 1 1-6.49-8.66"/>
      </svg>
    ),
    title: 'Genuine Guarantee',
    desc: '100% authentic parts with comprehensive warranty coverage.',
    highlight: '100% Authentic'
  },
  {
    icon: (
      // Price tag SVG
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-8.59 8.59a2 2 0 0 1-2.83 0l-6.59-6.59a2 2 0 0 1 0-2.83l8.59-8.59a2 2 0 0 1 2.83 0l6.59 6.59a2 2 0 0 1 0 2.83z"/>
        <circle cx="7.5" cy="7.5" r="1.5"/>
      </svg>
    ),
    title: 'Unbeatable Prices',
    desc: 'Price match guarantee with exclusive deals and bulk discounts.',
    highlight: 'Best Price'
  },
]

export default function WhyBuy() {
  return (
    <section className="w-full bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-roboto text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-gray-900">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Experience the difference with our commitment to quality, service, and customer satisfaction
          </p>
        </div>        {/* Desktop: 4 columns */}
        <div className="hidden lg:grid grid-cols-4 gap-8">
          {reasons.map((reason) => (
            <div 
              key={reason.title} 
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 hover:border-blue-200"
            >
              {/* Icon and highlight badge container - side by side */}
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})` 
                  }}
                >
                  {reason.icon}
                </div>
                
                <div 
                  className="px-3 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                  style={{ backgroundColor: colors.blue }}
                >
                  {reason.highlight}
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-inter font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                {reason.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {reason.desc}
              </p>

              {/* Decorative gradient line */}
              <div 
                className="absolute bottom-0 left-8 right-8 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(90deg, ${colors.blue}, ${colors.red})` 
                }}
              />
            </div>
          ))}
        </div>

        {/* Tablet: 2x2 Grid */}
        <div className="hidden sm:grid lg:hidden grid-cols-2 gap-6">
          {reasons.map((reason) => (
            <div 
              key={reason.title} 
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-blue-200"
            >
              {/* Icon and highlight badge container - side by side */}
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})` 
                  }}
                >
                  {reason.icon}
                </div>
                
                <div 
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white whitespace-nowrap"
                  style={{ backgroundColor: colors.blue }}
                >
                  {reason.highlight}
                </div>
              </div>
              
              <h3 className="font-inter font-bold text-base text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {reason.title}
              </h3>
              <p className="text-sm text-gray-600">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile: 2x2 Grid (2 cards per row, 4 cards in 2 rows) */}
        <div className="sm:hidden grid grid-cols-2 gap-4">
          {reasons.map((reason) => (
            <div 
              key={reason.title} 
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
            >
              {/* Icon and highlight badge container - side by side */}
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                  style={{ 
                    background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})` 
                  }}
                >
                  <div className="scale-75">
                    {reason.icon}
                  </div>
                </div>
                
                <div 
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white text-center min-w-0"
                  style={{ backgroundColor: colors.blue }}
                >
                  <div className="text-xs leading-tight">{reason.highlight}</div>
                </div>
              </div>
              
              <h3 className="font-inter font-bold text-sm text-gray-900 mb-2 leading-tight">
                {reason.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}