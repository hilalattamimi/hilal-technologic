import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({ error: 'Email already subscribed' }, { status: 400 })
      } else {
        // Reactivate subscription
        await prisma.newsletter.update({
          where: { email },
          data: { isActive: true, name },
        })
        return NextResponse.json({ message: 'Subscription reactivated' })
      }
    }

    // Create new subscription
    await prisma.newsletter.create({
      data: { email, name },
    })

    return NextResponse.json({ message: 'Successfully subscribed' }, { status: 201 })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const subscription = await prisma.newsletter.findUnique({
      where: { email },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 })
    }

    await prisma.newsletter.update({
      where: { email },
      data: { isActive: false },
    })

    return NextResponse.json({ message: 'Successfully unsubscribed' })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 })
  }
}
