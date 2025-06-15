import HeroBanner from './HeroBanner'
import HeroBanner2 from './HeroBanner2'
import FeaturedProducts from './FeaturedProducts'
import HighEndBuilds from './HighEndBuilds'
import CategoryShowcase from './CategoryShowcase'
import WhyBuy from './WhyBuy'
import Testimonials from './Testimonials'

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-black">      {/* Hero Section */}      <HeroBanner />
      {/* Featured Products */}
      <FeaturedProducts />      {/* High End Builds */}
      <HighEndBuilds />
      {/* Secondary Hero Banner */}
      <HeroBanner2 />
      {/* Category Showcase */}
      <CategoryShowcase />
      {/* Why Buy From Us */}
      <WhyBuy />
      {/* Testimonials */}
      <Testimonials />
      {/* TODO: Add Blog, Newsletter, etc. */}
    </main>
  )
} 