import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/products/ProductForm'

export const metadata: Metadata = {
  title: 'Edit Product',
}

async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { order: 'asc' } } },
  })
}

async function getCategories() {
  return prisma.productCategory.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Product</h2>
        <p className="text-muted-foreground">Update product details</p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  )
}
