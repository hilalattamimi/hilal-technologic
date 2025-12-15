import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DeleteButton from '@/components/admin/shared/DeleteButton'

export const metadata: Metadata = {
  title: 'Portfolio',
}

async function getPortfolios() {
  return prisma.portfolio.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function PortfolioAdminPage() {
  const portfolios = await getPortfolios()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio</h2>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Link href="/admin/portfolio/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
      </div>

      {portfolios.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No portfolio projects yet</p>
            <Link href="/admin/portfolio/new">
              <Button>Add your first project</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolios.map((portfolio) => (
            <Card key={portfolio.id} className="bg-card/50 border-border overflow-hidden">
              <div className="aspect-video bg-violet-950/30 flex items-center justify-center">
                {portfolio.thumbnail ? (
                  <img src={portfolio.thumbnail} alt={portfolio.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-violet-400/20">
                    {portfolio.title.charAt(0)}
                  </span>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{portfolio.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {portfolio.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {portfolio.isActive ? (
                      <Badge className="bg-green-500/10 text-green-500 text-xs">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-500/10 text-gray-500 text-xs">Draft</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/portfolio/${portfolio.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Edit</Button>
                  </Link>
                  <DeleteButton 
                    id={portfolio.id} 
                    endpoint="/api/admin/portfolio" 
                    itemName="project" 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
