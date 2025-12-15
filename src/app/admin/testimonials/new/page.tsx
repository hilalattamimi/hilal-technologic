import { Metadata } from 'next'
import TestimonialForm from '@/components/admin/testimonials/TestimonialForm'

export const metadata: Metadata = {
  title: 'Add Testimonial',
}

export default function NewTestimonialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Testimonial</h2>
        <p className="text-muted-foreground">Add a new customer testimonial</p>
      </div>

      <TestimonialForm />
    </div>
  )
}
