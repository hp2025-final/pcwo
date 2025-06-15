import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
// import { ProductsListing } from '@/components/public/ProductsListing' // TODO: Create this component later
// import { ProductFilters } from '@/components/public/ProductFilters' // TODO: Create this component later

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    page?: string
    sort?: string
    brand?: string
    price_min?: string
    price_max?: string
    [key: string]: string | undefined
  }>
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  seoTitle?: string
  seoDescription?: string
  productCount: number
  image?: string
}

// This will be replaced with actual API call
async function getCategory(slug: string): Promise<Category | null> {
  // TODO: Replace with actual API call
  // const category = await fetch(`/api/public/categories/${slug}`)
  
  // Placeholder data
  const categories: Record<string, Category> = {
    'processors': {
      id: '1',
      name: 'Processors (CPUs)',
      slug: 'processors',
      description: 'High-performance processors for gaming, productivity, and professional workloads',
      image: '/images/categories/processors.jpg',
      productCount: 156,
      seoTitle: 'Best Processors & CPUs in Pakistan - PC Wala Online',
      seoDescription: 'Shop the latest Intel and AMD processors. Find the perfect CPU for gaming, content creation, and professional work.'
    },
    'graphics-cards': {
      id: '2',
      name: 'Graphics Cards (GPUs)',
      slug: 'graphics-cards',
      description: 'Powerful graphics cards for gaming, content creation, and AI workloads',
      image: '/images/categories/graphics-cards.jpg',
      productCount: 89,
      seoTitle: 'Best Graphics Cards & GPUs in Pakistan - PC Wala Online',
      seoDescription: 'Shop NVIDIA RTX and AMD Radeon graphics cards. Get the best gaming and creative performance.'
    },
    'motherboards': {
      id: '3',
      name: 'Motherboards',
      slug: 'motherboards',
      description: 'Premium motherboards with the latest features and connectivity',
      image: '/images/categories/motherboards.jpg',
      productCount: 124,
      seoTitle: 'Best Motherboards in Pakistan - PC Wala Online',
      seoDescription: 'Shop Intel and AMD motherboards with latest chipsets, WiFi 6, and premium features.'
    },
    'memory': {
      id: '4',
      name: 'Memory (RAM)',
      slug: 'memory',
      description: 'High-speed DDR4 and DDR5 memory modules for optimal performance',
      image: '/images/categories/memory.jpg',
      productCount: 78,
      seoTitle: 'Best RAM & Memory in Pakistan - PC Wala Online',
      seoDescription: 'Shop DDR4 and DDR5 RAM from top brands. Get the memory you need for gaming and productivity.'
    },
    'storage': {
      id: '5',
      name: 'Storage',
      slug: 'storage',
      description: 'Fast SSDs and reliable HDDs for all your storage needs',
      image: '/images/categories/storage.jpg',
      productCount: 167,
      seoTitle: 'Best SSDs & Storage in Pakistan - PC Wala Online',
      seoDescription: 'Shop NVMe SSDs, SATA SSDs, and HDDs. Get fast and reliable storage solutions.'
    }
  }

  return categories[slug] || null
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategory(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found - PC Wala Online'
    }
  }

  return {
    title: category.seoTitle || `${category.name} - PC Wala Online`,
    description: category.seoDescription || category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = await getCategory(slug)

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {category.image && (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                  {category.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                <p className="text-gray-600 mb-2">{category.description}</p>
                <p className="text-sm text-gray-500">
                  {category.productCount} products available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">          <ol className="flex items-center space-x-4">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                Home
              </Link>
            </li>
            <li>
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            <li>
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </li>
            <li>
              <span className="text-gray-900 font-medium">{category.name}</span>
            </li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <Suspense fallback={<div className="animate-pulse bg-white rounded-lg h-96"></div>}>
              {/* <ProductFilters categorySlug={params.slug} /> TODO: Create this component later */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-4">Filters</h3>
                <p className="text-gray-500">Filters will be implemented later</p>
              </div>
            </Suspense>
          </aside>          {/* Products Grid */}
          <main className="flex-1">
            <Suspense fallback={<div className="animate-pulse bg-white rounded-lg h-96"></div>}>
              {/* <ProductsListing 
                categorySlug={params.slug}
                searchParams={searchParams}
              /> TODO: Create this component later */}
              <div className="bg-white rounded-lg p-4">
                <h3 className="font-semibold mb-4">Products</h3>
                <p className="text-gray-500">Product listing will be implemented later</p>
              </div>
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
