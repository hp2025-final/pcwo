import type { Metadata } from 'next'
import Header from '@/components/public/Header'
import Footer from '@/components/public/Footer'
import BottomBar from '@/components/public/BottomBar'

export const metadata: Metadata = {
  title: {
    template: '%s | PCWV2',
    default: 'PCWV2 - Your Premier PC Hardware Store in Pakistan',
  },
  description: 'Shop PC hardware components, build custom PCs, and get the best deals on computer parts in Pakistan. Free delivery nationwide.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <BottomBar />
    </div>
  )
}