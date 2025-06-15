import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin Login - PC Wala Online',
  description: 'Login to PC Wala Online admin panel',
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
