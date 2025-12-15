import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slide = await prisma.heroSlide.findUnique({
      where: { id: params.id },
    })

    if (!slide) {
      return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 })
    }

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Get hero slide error:', error)
    return NextResponse.json({ error: 'Failed to fetch hero slide' }, { status: 500 })
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
    const { title, subtitle, description, image, buttonText, buttonLink, order, isActive } = body

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) updateData.title = title
    if (subtitle !== undefined) updateData.subtitle = subtitle
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image
    if (buttonText !== undefined) updateData.buttonText = buttonText
    if (buttonLink !== undefined) updateData.buttonLink = buttonLink
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const slide = await prisma.heroSlide.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(slide)
  } catch (error) {
    console.error('Update hero slide error:', error)
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 })
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

    await prisma.heroSlide.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete hero slide error:', error)
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 })
  }
}
