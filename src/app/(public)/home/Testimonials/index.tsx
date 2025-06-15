import React from 'react'
import { colors } from '@/lib/colors'

const testimonials = [
  { 
    name: 'Ali Rahman', 
    role: 'Professional Gamer',
    quote: 'Best PC store for gamers! Super fast delivery and top-notch support. My new rig runs games at 4K 144fps flawlessly.', 
    avatar: '/images/user1.png', 
    rating: 5 
  },
  { 
    name: 'Sara Khan', 
    role: 'Content Creator',
    quote: 'Loved the product quality and the prices. Highly recommended! The custom build service helped me create the perfect streaming setup.', 
    avatar: '/images/user2.png', 
    rating: 5 
  },
  { 
    name: 'Zain Umar', 
    role: 'Software Developer',
    quote: 'The PC Builder tool is a game changer. Built my dream rig in minutes! Customer support was incredibly helpful throughout the process.', 
    avatar: '/images/user3.png', 
    rating: 5 
  },
]

// Avatar component with fallback
const Avatar = ({ name, size = "w-16 h-16" }: { name: string, size?: string }) => {
  return (
    <div 
      className={`${size} rounded-full p-1 flex-shrink-0`}
      style={{ 
        background: `linear-gradient(135deg, ${colors.blue}, ${colors.red})` 
      }}
    >
      <div 
        className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center text-white font-bold"
        style={{ color: colors.blue }}
      >
        {name.charAt(0)}
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="w-full bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-500 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-yellow-500 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-roboto text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white">
            What Our <span style={{ color: colors.blue }}>Customers</span> Say
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Real feedback from gamers, creators, and professionals who trust us with their PC builds
          </p>
        </div>        {/* Desktop: 3 columns */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name} 
              className="group relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 border border-gray-700 hover:border-blue-500/50 overflow-hidden"
            >
              {/* Quote mark */}              <div 
                className="absolute top-4 right-4 text-6xl opacity-20 font-serif"
                style={{ color: colors.blue }}
              >
                &quot;
              </div>
              
              {/* Avatar and info */}
              <div className="flex items-center mb-6">
                <Avatar name={testimonial.name} />
                <div className="ml-4">
                  <h4 className="font-inter font-bold text-white text-sm">{testimonial.name}</h4>
                  <p className="text-gray-400 text-xs">{testimonial.role}</p>
                </div>
              </div>
                {/* Quote */}
              <blockquote className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                &quot;{testimonial.quote}&quot;
              </blockquote>
              
              {/* Rating */}
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Decorative gradient line */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  background: `linear-gradient(90deg, ${colors.blue}, ${colors.red})` 
                }}
              />
            </div>
          ))}
        </div>

        {/* Tablet: Stacked layout with better spacing */}
        <div className="hidden sm:block md:hidden space-y-6">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name} 
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 shadow-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <Avatar name={testimonial.name} size="w-14 h-14" />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-inter font-bold text-white text-sm">{testimonial.name}</h4>
                      <p className="text-gray-400 text-xs">{testimonial.role}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                    </div>
                  </div>                  <blockquote className="text-gray-300 text-sm italic">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: 1 column stacked */}
        <div className="sm:hidden space-y-4">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.name} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 shadow-xl border border-gray-700"
            >
              <div className="flex items-center mb-4">
                <Avatar name={testimonial.name} size="w-12 h-12" />
                
                <div className="ml-3 flex-1">
                  <h4 className="font-inter font-bold text-white text-sm">{testimonial.name}</h4>
                  <p className="text-gray-400 text-xs">{testimonial.role}</p>
                </div>
                
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
              </div>
                <blockquote className="text-gray-300 text-sm italic leading-relaxed">
                &quot;{testimonial.quote}&quot;
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
