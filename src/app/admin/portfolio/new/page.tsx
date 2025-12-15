import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PortfolioForm from '@/components/admin/portfolio/PortfolioForm'

export const metadata: Metadata = {
  title: 'Add Portfolio',
}

async function getCategories() {
  return prisma.portfolioCategory.findMany({
    orderBy: { order: 'asc' },
  })
}

export default async function NewPortfolioPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Portfolio Project</h2>
        <p className="text-muted-foreground">Create a new portfolio project</p>
      </div>

      <PortfolioForm categories={categories} />
    </div>
  )
}
