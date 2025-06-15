import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate slug from string
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Format currency
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-PK').format(num)
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Generate order number
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `PCW${timestamp.slice(-6)}${random}`
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Pakistani format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '')
  if (cleaned.startsWith('+92')) {
    return cleaned
  }
  if (cleaned.startsWith('0')) {
    return '+92' + cleaned.slice(1)
  }
  return '+92' + cleaned
}

// Calculate discount percentage
export function calculateDiscountPercentage(originalPrice: number, salePrice: number): number {
  if (originalPrice <= 0 || salePrice >= originalPrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

// Deep merge objects
export function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = Object.assign({}, target)
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))          Object.assign(output, { [key]: source[key] })
        else if (isObject(target[key]) && isObject(source[key]))
          output[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  return output
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date and time
export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Get relative time
export function getRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return formatDate(date)
}

// Create WhatsApp URL
export function createWhatsAppURL(
  phone: string,
  message: string,
  orderId?: string
): string {
  const baseURL = 'https://wa.me/'
  const cleanPhone = phone.replace(/[^\d]/g, '')
  let fullMessage = message

  if (orderId) {
    fullMessage += `\n\nOrder ID: ${orderId}`
  }

  return `${baseURL}${cleanPhone}?text=${encodeURIComponent(fullMessage)}`
}

// Generate SKU
export function generateSKU(brandName: string, categoryName: string, productName: string): string {
  const brand = brandName.substring(0, 3).toUpperCase()
  const category = categoryName.substring(0, 3).toUpperCase()
  const product = productName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `${brand}${category}${product}${random}`
}

// Parse JSON safely
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Image URL helper
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '/images/placeholder.jpg'
  if (imagePath.startsWith('http')) return imagePath
  return `/uploads/${imagePath}`
}

// Calculate PC build compatibility score
export function calculateCompatibilityScore(components: Record<string, unknown>[]): number {
  // This is a simplified compatibility check
  // In a real implementation, you'd have complex rules for component compatibility
  let score = 100
  
  // Basic checks
  const hasEssentials = {
    cpu: components.some(c => c.componentType === 'CPU'),
    motherboard: components.some(c => c.componentType === 'MOTHERBOARD'),
    ram: components.some(c => c.componentType === 'RAM'),
    storage: components.some(c => c.componentType === 'STORAGE_PRIMARY'),
    psu: components.some(c => c.componentType === 'PSU'),
    case: components.some(c => c.componentType === 'CASE'),
  }
  
  // Deduct points for missing essential components
  Object.values(hasEssentials).forEach(hasComponent => {
    if (!hasComponent) score -= 15
  })
  
  return Math.max(0, score)
}
