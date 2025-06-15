// Re-export Prisma types for convenience
export type {
  AdminUser,
  AdminRole,
  Category,
  Brand,
  Product,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  OrderItem,
  Cart,
  CartItem,
  PCBuild,
  BuildComponent,
  ComponentType,
  SiteSetting,
  SettingType,
  Newsletter,
  ContactSubmission,
  PageView,
} from '@prisma/client'

import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ComponentType,
} from '@prisma/client'

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Product with relations
export interface ProductWithRelations {
  id: string
  name: string
  slug: string
  description?: string | null
  shortDescription?: string | null
  sku?: string | null
  price: number
  comparePrice?: number | null
  costPrice?: number | null
  stock: number
  lowStockThreshold: number
  weight?: number | null
  dimensions?: string | null
  isActive: boolean
  isFeatured: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  tags?: string | null
  specifications?: string | null
  compatibility?: string | null
  images?: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
    logo?: string | null
  }
}

// Category with subcategories
export interface CategoryWithSubcategories {
  id: string
  name: string
  slug: string
  description?: string | null
  image?: string | null
  isActive: boolean
  sortOrder: number
  parentId?: string | null
  subcategories: CategoryWithSubcategories[]
  _count: {
    products: number
  }
}

// Order with items
export interface OrderWithItems {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  subtotal: number
  taxAmount: number
  shippingAmount: number
  discountAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState?: string | null
  shippingZip?: string | null
  shippingCountry: string
  notes?: string | null
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  trackingNumber?: string | null
  estimatedDelivery?: Date | null
  deliveredAt?: Date | null
  createdAt: Date
  updatedAt: Date
  items: Array<{
    id: string
    quantity: number
    unitPrice: number
    totalPrice: number
    product: {
      id: string
      name: string
      slug: string
      images?: string | null
      sku?: string | null
    }
  }>
}

// PC Build with components
export interface PCBuildWithComponents {
  id: string
  name: string
  description?: string | null
  totalPrice: number
  isPublic: boolean
  isTemplate: boolean
  createdAt: Date
  updatedAt: Date
  components: Array<{
    id: string
    componentType: ComponentType
    quantity: number
    product: {
      id: string
      name: string
      slug: string
      price: number
      images?: string | null
      brand: {
        name: string
        logo?: string | null
      }
    }
  }>
}

// Cart with items
export interface CartWithItems {
  id: string
  sessionId: string
  expiresAt: Date
  items: Array<{
    id: string
    quantity: number
    product: {
      id: string
      name: string
      slug: string
      price: number
      comparePrice?: number | null
      stock: number
      images?: string | null
      brand: {
        name: string
      }
    }
  }>
}

// Admin dashboard stats
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: OrderWithItems[]
  lowStockProducts: ProductWithRelations[]
  topSellingProducts: Array<{
    product: ProductWithRelations
    totalSold: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
  }>
}

// Search filters
export interface ProductFilters {
  category?: string
  brand?: string
  priceMin?: number
  priceMax?: number
  inStock?: boolean
  featured?: boolean
  search?: string
  sortBy?: 'name' | 'price' | 'createdAt' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Component type information for PC Builder
export interface ComponentTypeInfo {
  type: ComponentType
  name: string
  description: string
  required: boolean
  multiple: boolean
  compatibilityRules?: string[]
}

// Compatibility check result
export interface CompatibilityCheck {
  isCompatible: boolean
  warnings: string[]
  errors: string[]
  suggestions: string[]
  score: number
}

// File upload types
export interface UploadedFile {
  filename: string
  originalName: string
  mimetype: string
  size: number
  path: string
  url: string
}

// WhatsApp message templates
export interface WhatsAppMessage {
  type: 'order' | 'inquiry' | 'support'
  message: string
  orderId?: string
  productId?: string
  buildId?: string
}

// Site configuration
export interface SiteConfig {
  siteName: string
  siteDescription: string
  siteUrl: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  address: string
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
    youtube?: string
  }
  seo: {
    defaultTitle: string
    defaultDescription: string
    keywords: string[]
  }
  features: {
    enableNewsletter: boolean
    enableContactForm: boolean
    enablePCBuilder: boolean
    enableWishlist: boolean
    enableCompare: boolean
  }
}

// Navigation item
export interface NavItem {
  title: string
  href: string
  icon?: string
  children?: NavItem[]
  external?: boolean
}

// Breadcrumb item
export interface BreadcrumbItem {
  title: string
  href?: string
}

// Table column definition
export interface TableColumn<T = Record<string, unknown>> {
  key: string
  title: string
  sortable?: boolean
  render?: (value: unknown, item: T) => React.ReactNode
  className?: string
}

// Form field types
export type FormFieldType = 
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'file'
  | 'image'
  | 'date'
  | 'datetime'
  | 'url'
  | 'tel'

export interface FormField {
  name: string
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  validation?: Record<string, unknown>
  className?: string
  helpText?: string
}
