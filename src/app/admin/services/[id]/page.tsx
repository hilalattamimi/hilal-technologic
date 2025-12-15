import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServiceForm from '@/components/admin/services/ServiceForm'

export const metadata: Metadata = {
  title: 'Edit Service',
}

async function getService(id: string) {
  return prisma.service.findUnique({
    where: { id },
  })
}

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await getService(params.id)

  if (!service) {
    notFound()
  }

  // Convert Decimal to number for client component
  const serializedService = {
    ...service,
    price: service.price ? Number(service.price) : null,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Service</h2>
        <p className="text-muted-foreground">Update service details</p>
      </div>

      <ServiceForm service={serializedService} />
    </div>
  )
}
