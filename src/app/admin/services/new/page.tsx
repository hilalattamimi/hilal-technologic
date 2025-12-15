import { Metadata } from 'next'
import ServiceForm from '@/components/admin/services/ServiceForm'

export const metadata: Metadata = {
  title: 'Add Service',
}

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Service</h2>
        <p className="text-muted-foreground">Create a new service</p>
      </div>

      <ServiceForm />
    </div>
  )
}
