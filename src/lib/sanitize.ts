// Input sanitization utilities

// Remove HTML tags
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '')
}

// Escape HTML entities
export function escapeHtml(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return input.replace(/[&<>"'/]/g, (char) => htmlEntities[char])
}

// Sanitize string input - trim and limit length
export function sanitizeString(
  input: unknown,
  maxLength: number = 1000
): string {
  if (typeof input !== 'string') {
    return ''
  }
  return input.trim().slice(0, maxLength)
}

// Sanitize email
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== 'string') {
    return ''
  }
  // Basic email sanitization - lowercase and trim
  return input.toLowerCase().trim().slice(0, 254)
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize phone number - keep only digits and common separators
export function sanitizePhone(input: unknown): string {
  if (typeof input !== 'string') {
    return ''
  }
  return input.replace(/[^\d+\-\s()]/g, '').slice(0, 20)
}

// Sanitize URL
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== 'string') {
    return ''
  }
  
  const trimmed = input.trim()
  
  // Only allow http and https protocols
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return ''
  }
  
  try {
    const url = new URL(trimmed)
    return url.toString()
  } catch {
    return ''
  }
}

// Sanitize integer
export function sanitizeInt(
  input: unknown,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER
): number {
  const num = parseInt(String(input), 10)
  if (isNaN(num)) {
    return min
  }
  return Math.max(min, Math.min(max, num))
}

// Sanitize float/decimal
export function sanitizeFloat(
  input: unknown,
  min: number = 0,
  max: number = Number.MAX_SAFE_INTEGER,
  decimals: number = 2
): number {
  const num = parseFloat(String(input))
  if (isNaN(num)) {
    return min
  }
  const clamped = Math.max(min, Math.min(max, num))
  return parseFloat(clamped.toFixed(decimals))
}

// Sanitize slug
export function sanitizeSlug(input: unknown): string {
  if (typeof input !== 'string') {
    return ''
  }
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100)
}

// Sanitize search query
export function sanitizeSearchQuery(input: unknown): string {
  if (typeof input !== 'string') {
    return ''
  }
  // Remove special characters that could be used for injection
  return input
    .trim()
    .replace(/[<>{}[\]\\]/g, '')
    .slice(0, 200)
}

// Validate and sanitize password
export function validatePassword(password: string): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password minimal 8 karakter')
  }
  
  if (password.length > 128) {
    errors.push('Password maksimal 128 karakter')
  }
  
  // Optional: Add more password requirements
  // if (!/[A-Z]/.test(password)) {
  //   errors.push('Password harus mengandung huruf besar')
  // }
  // if (!/[0-9]/.test(password)) {
  //   errors.push('Password harus mengandung angka')
  // }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

// Sanitize object - recursively sanitize all string values
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxStringLength: number = 1000
): T {
  const result: Record<string, unknown> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeString(value, maxStringLength)
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>, maxStringLength)
    } else {
      result[key] = value
    }
  }
  
  return result as T
}
