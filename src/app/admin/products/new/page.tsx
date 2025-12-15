import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/products/ProductForm'

export const metadata: Metadata = {
  title: 'Add Product',
}

async function getCategories() {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Product</h2>
        <p className="text-muted-foreground">Create a new product</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
