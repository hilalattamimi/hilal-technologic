import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm'

export const metadata: Metadata = {
  title: 'Edit Testimonial',
}

async function getTestimonial(id: string) {
  return prisma.testimonial.findUnique({
    where: { id },
  })
}

export default async function EditTestimonialPage({ params }: { params: { id: string } }) {
  const testimonial = await getTestimonial(params.id)

  if (!testimonial) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Testimonial</h2>
        <p className="text-muted-foreground">Update testimonial details</p>
      </div>

      <TestimonialForm testimonial={testimonial} />
    </div>
  )
}
