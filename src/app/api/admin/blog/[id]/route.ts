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
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { category: true, tags: true },
    })

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error('Get blog post error:', error)
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 })
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

    const updateData: Record<string, unknown> = {}

    if (title !== undefined) {
      updateData.title = title
      if (customSlug) {
        // Check if custom slug already exists (excluding current post)
        const existingPost = await prisma.blogPost.findFirst({ 
          where: { slug: customSlug, NOT: { id: params.id } } 
        })
        if (existingPost) {
          updateData.slug = `${customSlug}-${Date.now()}`
        } else {
          updateData.slug = customSlug
        }
      } else {
        const newSlug = slugify(title, { lower: true, strict: true })
        const existingPost = await prisma.blogPost.findFirst({ 
          where: { slug: newSlug, NOT: { id: params.id } } 
        })
        if (existingPost) {
          updateData.slug = `${newSlug}-${Date.now()}`
        } else {
          updateData.slug = newSlug
        }
      }
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (categoryId !== undefined) updateData.categoryId = categoryId || null
    if (author !== undefined) updateData.author = author
    if (isDraft !== undefined) updateData.isDraft = isDraft
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    
    // SEO fields
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription
    if (metaKeywords !== undefined) updateData.metaKeywords = metaKeywords
    if (ogImage !== undefined) updateData.ogImage = ogImage
    
    // Auto-save timestamp
    updateData.lastAutoSave = new Date()

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished
      if (isPublished) {
        const existingPost = await prisma.blogPost.findUnique({ where: { id: params.id } })
        if (!existingPost?.publishedAt) {
          updateData.publishedAt = new Date()
        }
        updateData.isDraft = false
      }
    }
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured

    if (tags !== undefined) {
      await prisma.blogPost.update({
        where: { id: params.id },
        data: { tags: { set: [] } },
      })

      if (tags.length > 0) {
        updateData.tags = {
          connectOrCreate: tags.map((tag: string) => ({
            where: { slug: slugify(tag, { lower: true, strict: true }) },
            create: { name: tag, slug: slugify(tag, { lower: true, strict: true }) },
          })),
        }
      }
    }

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true, tags: true },
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Update blog post error:', error)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 })
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

    await prisma.blogPost.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete blog post error:', error)
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 })
  }
}
