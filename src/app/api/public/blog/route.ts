import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        tags: true,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { publishedAt: 'desc' },
      ],
    })

    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json({ posts, categories })
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}
