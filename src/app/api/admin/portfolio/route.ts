import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: { category: true, images: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(portfolios)
  } catch (error) {
    console.error('Get portfolios error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, client, projectUrl, thumbnail, categoryId, technologies, completedAt, isFeatured, isActive, images } = body

    const slug = slugify(title, { lower: true, strict: true })

    const portfolio = await prisma.portfolio.create({
      data: {
        title,
        slug,
        description,
        content,
        client,
        projectUrl,
        thumbnail,
        categoryId: categoryId || null,
        technologies: technologies || [],
        completedAt: completedAt ? new Date(completedAt) : null,
        isFeatured: isFeatured ?? false,
        isActive: isActive ?? true,
        images: images?.length
          ? {
              create: images.map((url: string, index: number) => ({
                url,
                order: index,
              })),
            }
          : undefined,
      },
      include: { category: true, images: true },
    })

    return NextResponse.json(portfolio, { status: 201 })
  } catch (error) {
    console.error('Create portfolio error:', error)
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}
