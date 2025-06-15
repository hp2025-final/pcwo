import React from 'react'
import Image from 'next/image'

export default function HeroBanner2() {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Hero Image */}
      <div className="absolute inset-0">
        <Image
          src="/uploads/products/herobanner-sample.jpeg"
          alt="Ultimate Gaming Experience"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Ultimate Gaming
              <span className="text-blue-500"> Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Discover premium gaming setups with cutting-edge technology and lightning-fast performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Explore Builds
              </a>
              <a 
                href="#" 
                className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Custom Build
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
