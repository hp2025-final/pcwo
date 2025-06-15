// Application constants and configuration

export const APP_CONFIG = {
  name: 'PC Wala Online',
  version: '2.0.0',
  description: 'Your Premier PC Hardware Store in Pakistan',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  supportEmail: 'support@pcwala.com',
} as const

export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/[slug]',
  CATEGORIES: '/categories',
  CATEGORY_DETAIL: '/categories/[slug]',
  PC_BUILDER: '/build',
  CART: '/cart',
  CHECKOUT: '/checkout',
  CONTACT: '/contact',
  ABOUT: '/about',
  
  // Admin routes
  ADMIN_HOME: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_BRANDS: '/admin/brands',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_CUSTOMERS: '/admin/customers',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_SETTINGS: '/admin/settings',
  
  // API routes
  API_HEALTH: '/api/health',
  API_AUTH: '/api/auth',
  API_PRODUCTS: '/api/products',
  API_CATEGORIES: '/api/categories',
  API_BRANDS: '/api/brands',
  API_ORDERS: '/api/orders',
  API_CART: '/api/cart',
  API_UPLOAD: '/api/upload',
} as const

export const COMPONENT_TYPES = [
  { value: 'CPU', label: 'Processor (CPU)', required: true, multiple: false },
  { value: 'MOTHERBOARD', label: 'Motherboard', required: true, multiple: false },
  { value: 'RAM', label: 'Memory (RAM)', required: true, multiple: true },
  { value: 'GPU', label: 'Graphics Card (GPU)', required: false, multiple: false },
  { value: 'STORAGE_PRIMARY', label: 'Primary Storage', required: true, multiple: false },
  { value: 'STORAGE_SECONDARY', label: 'Secondary Storage', required: false, multiple: true },
  { value: 'PSU', label: 'Power Supply (PSU)', required: true, multiple: false },
  { value: 'CASE', label: 'PC Case', required: true, multiple: false },
  { value: 'CPU_COOLER', label: 'CPU Cooler', required: true, multiple: false },
  { value: 'CASE_FANS', label: 'Case Fans', required: false, multiple: true },
  { value: 'OPTICAL_DRIVE', label: 'Optical Drive', required: false, multiple: false },
  { value: 'NETWORK_CARD', label: 'Network Card', required: false, multiple: false },
  { value: 'SOUND_CARD', label: 'Sound Card', required: false, multiple: false },
  { value: 'MONITOR', label: 'Monitor', required: false, multiple: true },
  { value: 'KEYBOARD', label: 'Keyboard', required: false, multiple: false },
  { value: 'MOUSE', label: 'Mouse', required: false, multiple: false },
  { value: 'SPEAKERS', label: 'Speakers', required: false, multiple: false },
  { value: 'HEADSET', label: 'Headset', required: false, multiple: false },
  { value: 'UPS', label: 'UPS', required: false, multiple: false },
  { value: 'WEBCAM', label: 'Webcam', required: false, multiple: false },
  { value: 'OTHER', label: 'Other', required: false, multiple: true },
] as const

export const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
  { value: 'PROCESSING', label: 'Processing', color: 'purple' },
  { value: 'SHIPPED', label: 'Shipped', color: 'indigo' },
  { value: 'DELIVERED', label: 'Delivered', color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'red' },
  { value: 'REFUNDED', label: 'Refunded', color: 'gray' },
] as const

export const PAYMENT_METHODS = [
  { value: 'WHATSAPP', label: 'WhatsApp Order' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CASH_ON_DELIVERY', label: 'Cash on Delivery' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
] as const

export const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'yellow' },
  { value: 'PAID', label: 'Paid', color: 'green' },
  { value: 'FAILED', label: 'Failed', color: 'red' },
  { value: 'REFUNDED', label: 'Refunded', color: 'gray' },
  { value: 'PARTIALLY_REFUNDED', label: 'Partially Refunded', color: 'orange' },
] as const

export const ADMIN_ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MODERATOR', label: 'Moderator' },
] as const

export const SETTING_TYPES = [
  { value: 'TEXT', label: 'Text' },
  { value: 'TEXTAREA', label: 'Textarea' },
  { value: 'NUMBER', label: 'Number' },
  { value: 'BOOLEAN', label: 'Boolean' },
  { value: 'JSON', label: 'JSON' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'URL', label: 'URL' },
] as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PRODUCTS_PER_PAGE: 24,
  ORDERS_PER_PAGE: 25,
  ADMIN_ITEMS_PER_PAGE: 20,
} as const

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  UPLOAD_DIR: 'public/uploads',
  PRODUCT_IMAGES_DIR: 'products',
  CATEGORY_IMAGES_DIR: 'categories',
  BRAND_LOGOS_DIR: 'brands',
} as const

export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 8,
  PRODUCT_NAME_MAX_LENGTH: 200,
  SKU_MAX_LENGTH: 50,
  PHONE_REGEX: /^(\+92|0)?[0-9]{10}$/, // Pakistani phone format
  MOBILE_REGEX: /^(\+92|0)?3[0-9]{9}$/, // Pakistani mobile format  
  SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  POSTAL_CODE_REGEX: /^[0-9]{5}$/, // Pakistani postal code format
} as const

export const DEFAULT_MESSAGES = {
  WHATSAPP_ORDER: 'Hi! I would like to place an order for the following items:',
  WHATSAPP_INQUIRY: 'Hi! I have a question about:',
  WHATSAPP_SUPPORT: 'Hi! I need support with:',
  SUCCESS_ORDER_PLACED: 'Your order has been placed successfully!',
  SUCCESS_CART_UPDATED: 'Cart updated successfully!',
  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_NOT_FOUND: 'The requested item was not found.',
  ERROR_UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const

export const CURRENCY = {
  CODE: 'PKR',
  SYMBOL: 'Rs.',
  NAME: 'Pakistani Rupee',
} as const

export const COUNTRY_INFO = {
  CODE: 'PK',
  NAME: 'Pakistan',
  PHONE_CODE: '+92',
  TIMEZONE: 'Asia/Karachi',
  LOCALE: 'en-PK',
  MAJOR_CITIES: [
    'Karachi',
    'Lahore',
    'Faisalabad',
    'Rawalpindi',
    'Multan',
    'Hyderabad',
    'Gujranwala',
    'Peshawar',
    'Quetta',
    'Islamabad'
  ]
} as const

export const SHIPPING_ZONES = {
  MAJOR_CITIES: {
    cost: 200,
    delivery_days: '1-2',
    cities: ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad']
  },
  OTHER_CITIES: {
    cost: 300,
    delivery_days: '2-4',
    cities: ['Other cities']
  },
  REMOTE_AREAS: {
    cost: 500,
    delivery_days: '3-7',
    cities: ['Remote areas']
  }
} as const

export const CACHE_KEYS = {
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  PRODUCTS: 'products',
  FEATURED_PRODUCTS: 'featured-products',
  SITE_SETTINGS: 'site-settings',
} as const

export const CACHE_TTL = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 30 * 60, // 30 minutes
  LONG: 24 * 60 * 60, // 24 hours
} as const
