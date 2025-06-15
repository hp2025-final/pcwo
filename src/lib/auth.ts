import { NextRequest } from 'next/server'

export interface JWTPayload {
  userId: string
  email: string
  role: string
}

// Simple JWT verification for middleware (Edge Runtime compatible)
export function verifyToken(token: string): JWTPayload | null {
  try {
    // Simple base64 decode and validation (for middleware only)
    // In production, use proper JWT verification
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = JSON.parse(atob(parts[1]))
    
    // Basic expiration check
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return null
    }
    
    return payload as JWTPayload  } catch {
    return null
  }
}

// Extract token from request
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check for cookie-based authentication
  const tokenCookie = request.cookies.get('auth-token')
  return tokenCookie?.value || null
}

// Get user from request
export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(request)
  if (!token) return null
  
  return verifyToken(token)
}

// Generate session ID
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
