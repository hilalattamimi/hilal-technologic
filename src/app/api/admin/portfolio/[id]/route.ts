import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: params.id },
      include: { category: true, images: { orderBy: { order: 'asc' } } },
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Get portfolio error:', error)
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, content, client, projectUrl, thumbnail, categoryId, technologies, completedAt, isFeatured, isActive, images } = body

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) {
      updateData.title = title
      updateData.slug = slugify(title, { lower: true, strict: true })
    }
    if (description !== undefined) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (client !== undefined) updateData.client = client
    if (projectUrl !== undefined) updateData.projectUrl = projectUrl
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (technologies !== undefined) updateData.technologies = technologies
    if (completedAt !== undefined) updateData.completedAt = completedAt ? new Date(completedAt) : null
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (isActive !== undefined) updateData.isActive = isActive

    if (images !== undefined) {
      await prisma.portfolioImage.deleteMany({
        where: { portfolioId: params.id },
      })

      if (images.length > 0) {
        await prisma.portfolioImage.createMany({
          data: images.map((url: string, index: number) => ({
            portfolioId: params.id,
            url,
            order: index,
          })),
        })
      }
    }

    const portfolio = await prisma.portfolio.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true, images: { orderBy: { order: 'asc' } } },
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    console.error('Update portfolio error:', error)
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.portfolio.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete portfolio error:', error)
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}
