import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Menu Preview',
  description: 'Preview navigation menu',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
