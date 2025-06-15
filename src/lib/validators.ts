import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  registrationCode: z.string().min(1, 'Registration code is required'),
})

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required').optional(), // Make slug optional for updates
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  sku: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  lowStockThreshold: z.number().int().min(0).default(5),
  weight: z.number().positive().optional(),
  dimensions: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  compatibility: z.record(z.any()).optional(),
  images: z.array(z.string()).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  brandId: z.string().min(1, 'Brand is required'),
})

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  slug: z.string().min(1, 'Slug is required').max(100, 'Slug must be less than 100 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional().transform(val => val === '' ? undefined : val),
  image: z.string().optional().transform(val => val === '' ? undefined : val),
  isActive: z.boolean().default(true),  parentCategoryId: z.string().optional().nullable().transform(val => val === '' ? null : val),
  sortOrder: z.number().int().min(0, 'Sort order must be a positive number').default(0),
  seoTitle: z.string().max(200, 'SEO title must be less than 200 characters').optional().transform(val => val === '' ? undefined : val),
  seoDescription: z.string().max(500, 'SEO description must be less than 500 characters').optional().transform(val => val === '' ? undefined : val),
  specificationTemplate: z.string().optional().transform(val => val === '' ? undefined : val), // JSON string for specification fields
})

// Brand validation schemas
export const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
})

// Order validation schemas
export const orderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  customerEmail: z.string().email('Invalid email address'),
  customerPhone: z.string().min(10, 'Valid phone number is required'),
  shippingAddress: z.string().min(1, 'Shipping address is required'),
  shippingCity: z.string().min(1, 'City is required'),
  shippingState: z.string().optional(),
  shippingZip: z.string().optional(),
  shippingCountry: z.string().default('Pakistan'),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1, 'At least one item is required'),
})

// Cart validation schemas
export const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
})

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
})

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
})

// PC Build validation schemas
export const pcBuildSchema = z.object({
  name: z.string().min(1, 'Build name is required'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
  components: z.array(z.object({
    componentType: z.enum([
      'CPU', 'MOTHERBOARD', 'RAM', 'GPU', 'STORAGE_PRIMARY', 'STORAGE_SECONDARY',
      'PSU', 'CASE', 'CPU_COOLER', 'CASE_FANS', 'OPTICAL_DRIVE', 'NETWORK_CARD',
      'SOUND_CARD', 'MONITOR', 'KEYBOARD', 'MOUSE', 'SPEAKERS', 'HEADSET', 'UPS',
      'WEBCAM', 'OTHER'
    ]),
    productId: z.string(),
    quantity: z.number().int().positive().default(1),
  })),
})

// Site settings validation schema
export const siteSettingSchema = z.object({
  key: z.string().min(1, 'Setting key is required'),
  value: z.string().optional(),
  type: z.enum(['TEXT', 'TEXTAREA', 'NUMBER', 'BOOLEAN', 'JSON', 'IMAGE', 'URL']).default('TEXT'),
  category: z.string().default('general'),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type BrandInput = z.infer<typeof brandSchema>
export type OrderInput = z.infer<typeof orderSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
export type PCBuildInput = z.infer<typeof pcBuildSchema>
export type SiteSettingInput = z.infer<typeof siteSettingSchema>
