import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DeleteButton from '@/components/admin/shared/DeleteButton'

export const metadata: Metadata = {
  title: 'Categories',
}

async function getCategories() {
  const [productCategories, portfolioCategories, blogCategories] = await Promise.all([
    prisma.productCategory.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { order: 'asc' },
    }),
    prisma.portfolioCategory.findMany({
      include: { _count: { select: { projects: true } } },
      orderBy: { order: 'asc' },
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { name: 'asc' },
    }),
  ])

  return { productCategories, portfolioCategories, blogCategories }
}

export default async function CategoriesAdminPage() {
  const { productCategories, portfolioCategories, blogCategories } = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Categories</h2>
        <p className="text-muted-foreground">Manage categories for products, portfolio, and blog</p>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Product Categories</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Categories</TabsTrigger>
          <TabsTrigger value="blog">Blog Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link href="/admin/categories/products/new">
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
          {productCategories.length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No product categories yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {productCategories.map((category) => (
                <Card key={category.id} className="bg-card/50 border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category._count.products} products</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {category.isActive ? (
                        <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-500">Hidden</Badge>
                      )}
                      <Link href={`/admin/categories/products/${category.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <DeleteButton 
                        id={category.id} 
                        endpoint="/api/admin/categories/products" 
                        itemName="category" 
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="portfolio" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link href="/admin/categories/portfolio/new">
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
          {portfolioCategories.length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No portfolio categories yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {portfolioCategories.map((category) => (
                <Card key={category.id} className="bg-card/50 border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category._count.projects} projects</p>
                    </div>
                    <Link href={`/admin/categories/portfolio/${category.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteButton 
                      id={category.id} 
                      endpoint="/api/admin/categories/portfolio" 
                      itemName="category" 
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="blog" className="mt-6">
          <div className="flex justify-end mb-4">
            <Link href="/admin/categories/blog/new">
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
          </div>
          {blogCategories.length === 0 ? (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No blog categories yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {blogCategories.map((category) => (
                <Card key={category.id} className="bg-card/50 border-border">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category._count.posts} posts</p>
                    </div>
                    <Link href={`/admin/categories/blog/${category.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <DeleteButton 
                      id={category.id} 
                      endpoint="/api/admin/categories/blog" 
                      itemName="category" 
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
