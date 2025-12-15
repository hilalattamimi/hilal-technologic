import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { rateLimit, strictRateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { sanitizeEmail } from '@/lib/sanitize'

export async function POST(request: NextRequest) {
  // Strict rate limiting for resend verification
  const { success, reset } = rateLimit(request, strictRateLimit)
  if (!success) {
    return rateLimitResponse(reset)
  }

  try {
    const body = await request.json()
    const email = sanitizeEmail(body.email)

    if (!email) {
      return NextResponse.json(
        { error: 'Email diperlukan' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({
        message: 'Jika email terdaftar, kami akan mengirim link verifikasi.',
      })
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email sudah terverifikasi. Silakan login.' },
        { status: 400 }
      )
    }

    // Generate new verification token and send email
    const verificationToken = await generateVerificationToken(email)
    await sendVerificationEmail(email, verificationToken.token)

    return NextResponse.json({
      message: 'Email verifikasi telah dikirim. Silakan cek inbox Anda.',
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Gagal mengirim email verifikasi' },
      { status: 500 }
    )
  }
}
