import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogFormAdvanced from '@/components/admin/blog/BlogFormAdvanced'

export const metadata: Metadata = {
  title: 'Edit Blog Post',
}

async function getBlogPost(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
    include: { tags: true },
  })
}

async function getCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  const [post, categories] = await Promise.all([
    getBlogPost(params.id),
    getCategories(),
  ])

  if (!post) {
    notFound()
  }

  // Serialize dates for client component
  const serializedPost = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
    scheduledAt: post.scheduledAt?.toISOString() || null,
  }

  return (
    <div className="space-y-6">
      <BlogFormAdvanced post={serializedPost} categories={categories} />
    </div>
  )
}
