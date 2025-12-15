import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import DeleteButton from '@/components/admin/shared/DeleteButton'

export const metadata: Metadata = {
  title: 'Hero Slides',
}

async function getHeroSlides() {
  return prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  })
}

export default async function HeroSlidesAdminPage() {
  const slides = await getHeroSlides()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Hero Slides</h2>
          <p className="text-muted-foreground">Manage homepage hero carousel</p>
        </div>
        <Link href="/admin/hero-slides/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Slide
          </Button>
        </Link>
      </div>

      {slides.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No hero slides yet</p>
            <Link href="/admin/hero-slides/new">
              <Button>Add your first slide</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide, index) => (
            <Card key={slide.id} className="bg-card/50 border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-48 h-32 bg-violet-950/30 flex items-center justify-center flex-shrink-0">
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-violet-400/20">
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">#{slide.order}</span>
                        <h3 className="font-semibold">{slide.title}</h3>
                      </div>
                      {slide.subtitle && (
                        <p className="text-sm text-violet-400">{slide.subtitle}</p>
                      )}
                      {slide.description && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {slide.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {slide.isActive ? (
                        <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-500/10 text-gray-500">Hidden</Badge>
                      )}
                      <Link href={`/admin/hero-slides/${slide.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                      </Link>
                      <DeleteButton 
                        id={slide.id} 
                        endpoint="/api/admin/hero-slides" 
                        itemName="slide" 
                      />
                    </div>
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
