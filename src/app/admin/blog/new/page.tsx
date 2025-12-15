import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import BlogFormAdvanced from '@/components/admin/blog/BlogFormAdvanced'

export const metadata: Metadata = {
  title: 'New Blog Post',
}

async function getCategories() {
  return prisma.blogCategory.findMany({
    orderBy: { name: 'asc' },
  })
}

export default async function NewBlogPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <BlogFormAdvanced categories={categories} />
    </div>
  )
}
