import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import DeleteButton from '@/components/admin/shared/DeleteButton'

export const metadata: Metadata = {
  title: 'Blog',
}

async function getBlogPosts() {
  return prisma.blogPost.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function BlogAdminPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <p className="text-muted-foreground">Manage your blog articles</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No blog posts yet</p>
            <Link href="/admin/blog/new">
              <Button>Write your first post</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <Card key={post.id} className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-violet-950/30 flex items-center justify-center overflow-hidden">
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-violet-400 font-bold text-xl">
                          {post.title.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {post.category?.name || 'Uncategorized'} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {post.views} views
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.isPublished ? (
                      <Badge className="bg-green-500/10 text-green-500">Published</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-500">Draft</Badge>
                    )}
                    {post.isFeatured && (
                      <Badge className="bg-violet-500/10 text-violet-500">Featured</Badge>
                    )}
                    <Link href={`/admin/blog/${post.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteButton 
                      id={post.id} 
                      endpoint="/api/admin/blog" 
                      itemName="post" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
