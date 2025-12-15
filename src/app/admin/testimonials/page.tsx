import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DeleteButton from '@/components/admin/shared/DeleteButton'

export const metadata: Metadata = {
  title: 'Testimonials',
}

async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { order: 'asc' },
  })
}

export default async function TestimonialsAdminPage() {
  const testimonials = await getTestimonials()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Testimonials</h2>
          <p className="text-muted-foreground">Manage customer testimonials</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      {testimonials.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No testimonials yet</p>
            <Link href="/admin/testimonials/new">
              <Button>Add your first testimonial</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-card/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.image || ''} alt={testimonial.name} />
                    <AvatarFallback className="bg-violet-500/20 text-violet-400">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.position}{testimonial.company ? `, ${testimonial.company}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        {testimonial.isActive ? (
                          <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-500/10 text-gray-500">Hidden</Badge>
                        )}
                        <Link href={`/admin/testimonials/${testimonial.id}`}>
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                        <DeleteButton 
                          id={testimonial.id} 
                          endpoint="/api/admin/testimonials" 
                          itemName="testimonial" 
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
