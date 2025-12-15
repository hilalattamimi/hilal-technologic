import { NextRequest, NextResponse } from 'next/server'

interface RateLimitConfig {
  interval: number // in milliseconds
  limit: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (for production, use Redis)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now()
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  })
}, 60000) // Clean up every minute

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return '127.0.0.1'
}

export function rateLimit(
  request: NextRequest,
  config: RateLimitConfig = { interval: 60000, limit: 60 } // Default: 60 requests per minute
): { success: boolean; remaining: number; reset: number } {
  const ip = getClientIP(request)
  const key = `${ip}:${request.nextUrl.pathname}`
  const now = Date.now()
  
  let entry = rateLimitStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + config.interval,
    }
  }
  
  entry.count++
  rateLimitStore.set(key, entry)
  
  const remaining = Math.max(0, config.limit - entry.count)
  const reset = Math.ceil((entry.resetTime - now) / 1000)
  
  return {
    success: entry.count <= config.limit,
    remaining,
    reset,
  }
}

export function rateLimitResponse(reset: number): NextResponse {
  return NextResponse.json(
    { error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(reset),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(reset),
      },
    }
  )
}

// Middleware helper for API routes
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  config?: RateLimitConfig
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const { success, remaining, reset } = rateLimit(request, config)
    
    if (!success) {
      return rateLimitResponse(reset)
    }
    
    const response = await handler(request)
    
    // Add rate limit headers to response
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    response.headers.set('X-RateLimit-Reset', String(reset))
    
    return response
  }
}

// Stricter rate limit for auth endpoints
export const authRateLimit: RateLimitConfig = {
  interval: 60000, // 1 minute
  limit: 5, // 5 attempts per minute
}

// Standard API rate limit
export const apiRateLimit: RateLimitConfig = {
  interval: 60000, // 1 minute
  limit: 60, // 60 requests per minute
}

// Strict rate limit for sensitive operations
export const strictRateLimit: RateLimitConfig = {
  interval: 3600000, // 1 hour
  limit: 10, // 10 attempts per hour
}
