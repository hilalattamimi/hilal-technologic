import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import HeroSlideForm from '@/components/admin/hero-slides/HeroSlideForm'

export const metadata: Metadata = {
  title: 'Edit Hero Slide',
}

async function getHeroSlide(id: string) {
  return prisma.heroSlide.findUnique({
    where: { id },
  })
}

export default async function EditHeroSlidePage({ params }: { params: { id: string } }) {
  const slide = await getHeroSlide(params.id)

  if (!slide) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Hero Slide</h2>
        <p className="text-muted-foreground">Update hero slide details</p>
      </div>

      <HeroSlideForm slide={slide} />
    </div>
  )
}
