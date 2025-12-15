import { Metadata } from 'next'
import HeroSlideForm from '@/components/admin/hero-slides/HeroSlideForm'

export const metadata: Metadata = {
  title: 'Add Hero Slide',
}

export default function NewHeroSlidePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Hero Slide</h2>
        <p className="text-muted-foreground">Add a new hero carousel slide</p>
      </div>

      <HeroSlideForm />
    </div>
  )
}
