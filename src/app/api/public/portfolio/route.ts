import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const projects = await prisma.portfolio.findMany({
      where: { isActive: true },
      include: {
        category: true,
        images: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { completedAt: 'desc' },
      ],
    })

    const categories = await prisma.portfolioCategory.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ projects, categories })
  } catch (error) {
    console.error('Get portfolio error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}
