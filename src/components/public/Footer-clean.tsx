import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">PCWV2</h2>                <p className="text-gray-300 text-sm">
                  Pakistan&apos;s premier destination for PC hardware and custom builds. 
                  We provide high-quality components and expert guidance.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-blue-400" />
                  <span className="text-sm">+92 300 123 4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-blue-400" />
                  <span className="text-sm">info@pcwv2.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-blue-400" />
                  <span className="text-sm">Karachi, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/components" className="text-gray-300 hover:text-white text-sm transition-colors">
                    PC Components
                  </Link>
                </li>
                <li>
                  <Link href="/gaming-rigs" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Gaming Rigs
                  </Link>
                </li>
                <li>
                  <Link href="/office-builds" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Office Builds
                  </Link>
                </li>
                <li>
                  <Link href="/accessories" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Accessories
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Brands
                  </Link>
                </li>
                <li>
                  <Link href="/pc-builder" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                    PC Builder
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white text-sm transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-300 hover:text-white text-sm transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/warranty" className="text-gray-300 hover:text-white text-sm transition-colors">
                    Warranty
                  </Link>
                </li>
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Stay Connected</h3>
              
              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-gray-300 text-sm mb-3">
                  Get updates on new products and exclusive deals
                </p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-r-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <p className="text-gray-300 text-sm mb-3">Follow us</p>
                <div className="flex space-x-3">
                  <a href="#" className="p-2 bg-gray-800 hover:bg-blue-600 rounded-lg transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="p-2 bg-gray-800 hover:bg-blue-400 rounded-lg transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href="#" className="p-2 bg-gray-800 hover:bg-pink-600 rounded-lg transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="p-2 bg-gray-800 hover:bg-red-600 rounded-lg transition-colors">
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} PCWV2. All rights reserved.
            </div>
            
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
