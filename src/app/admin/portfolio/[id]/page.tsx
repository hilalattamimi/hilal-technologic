import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PortfolioForm from '@/components/admin/portfolio/PortfolioForm'

export const metadata: Metadata = {
  title: 'Edit Portfolio',
}

async function getPortfolio(id: string) {
  return prisma.portfolio.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })
}

async function getCategories() {
  return prisma.portfolioCategory.findMany({
    orderBy: { order: 'asc' },
  })
}

export default async function EditPortfolioPage({ params }: { params: { id: string } }) {
  const [portfolio, categories] = await Promise.all([
    getPortfolio(params.id),
    getCategories(),
  ])

  if (!portfolio) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Portfolio Project</h2>
        <p className="text-muted-foreground">Update project details</p>
      </div>

      <PortfolioForm portfolio={portfolio} categories={categories} />
    </div>
  )
}
