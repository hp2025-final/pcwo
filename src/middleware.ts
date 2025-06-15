import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Paths that require authentication
const protectedPaths = ['/admin/dashboard', '/admin/products', '/admin/categories', '/admin/orders', '/admin/settings']

// Paths that should redirect authenticated users
const authPaths = ['/admin/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('admin-token')?.value
  // Check if the path is protected (admin routes)
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))
  // Redirect /admin to /admin/dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  // If accessing protected path without valid token
  if (isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Verify token
    const payload = verifyToken(token)
    if (!payload) {
      // Invalid token, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-token')
      return response
    }
  }

  // If accessing auth path with valid token, redirect to admin dashboard
  if (isAuthPath && token) {
    const payload = verifyToken(token)
    if (payload) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
}
