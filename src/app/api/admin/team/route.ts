import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Get team members error:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, position, bio, image, email, phone, linkedin, twitter, github, order, isActive } = body

    const member = await prisma.teamMember.create({
      data: {
        name,
        position,
        bio,
        image,
        email,
        phone,
        linkedin,
        twitter,
        github,
        order: order || 0,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Create team member error:', error)
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 })
  }
}
