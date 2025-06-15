import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | PC Wala Online',
    default: 'PC Wala Online - Your Premier PC Hardware Store in Pakistan',
  },
  description: 'Discover the best PC hardware components, custom PC builds, and tech solutions in Pakistan. Quality products, competitive prices, and expert service.',
  keywords: 'PC hardware, computer parts, gaming PC, custom build, Pakistan, graphics card, processor, motherboard, RAM, storage',
  authors: [{ name: 'PC Wala Online' }],
  creator: 'PC Wala Online',
  publisher: 'PC Wala Online',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    siteName: 'PC Wala Online',
    title: 'PC Wala Online - Your Premier PC Hardware Store in Pakistan',
    description: 'Discover the best PC hardware components, custom PC builds, and tech solutions in Pakistan.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PC Wala Online - Your Premier PC Hardware Store in Pakistan',
    description: 'Discover the best PC hardware components, custom PC builds, and tech solutions in Pakistan.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
