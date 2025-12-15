import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeatured: 'desc' },
        { order: 'asc' },
      ],
    })

    // Convert Decimal to number for JSON serialization
    const serializedServices = services.map(service => ({
      ...service,
      price: service.price ? Number(service.price) : null,
    }))

    return NextResponse.json({ services: serializedServices })
  } catch (error) {
    console.error('Get services error:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}
