import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { rateLimit, authRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { sanitizeEmail, sanitizeString } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  // Rate limiting for auth endpoints
  const { success, reset } = rateLimit(request, authRateLimit)
  if (!success) {
    return rateLimitResponse(reset)
  }

  try {
    const body = await request.json()
    
    // Sanitize inputs
    const name = sanitizeString(body.name, 100)
    const email = sanitizeEmail(body.email)
    const password = body.password as string

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password diperlukan' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password minimal 8 karakter' },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Not verified yet
      },
    })

    // Generate verification token and send email
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, verificationToken.token)

    return NextResponse.json(
      { 
        message: 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.',
        userId: user.id,
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Gagal membuat akun' },
      { status: 500 }
    )
  }
}
