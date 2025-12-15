import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import slugify from 'slugify'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      include: { category: true, tags: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Get blog posts error:', error)
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      slug: customSlug,
      excerpt, 
      content, 
      thumbnail, 
      categoryId, 
      author, 
      isPublished, 
      isFeatured, 
      isDraft,
      scheduledAt,
      publishedAt,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage,
    } = body

    let slug = customSlug || slugify(title, { lower: true, strict: true })

    // Check if slug already exists and make it unique
    const existingPost = await prisma.blogPost.findUnique({ where: { slug } })
    if (existingPost) {
      slug = `${slug}-${Date.now()}`
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        thumbnail,
        categoryId: categoryId || null,
        author: author || session.user.name,
        isPublished: isPublished ?? false,
        isFeatured: isFeatured ?? false,
        isDraft: isDraft ?? true,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        publishedAt: publishedAt ? new Date(publishedAt) : (isPublished ? new Date() : null),
        metaTitle,
        metaDescription,
        metaKeywords,
        ogImage,
        lastAutoSave: new Date(),
        tags: tags?.length
          ? {
              connectOrCreate: tags.map((tag: string) => ({
                where: { slug: slugify(tag, { lower: true, strict: true }) },
                create: { name: tag, slug: slugify(tag, { lower: true, strict: true }) },
              })),
            }
          : undefined,
      },
      include: { category: true, tags: true },
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Create blog post error:', error)
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
}
