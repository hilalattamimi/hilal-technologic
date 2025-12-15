import { Metadata } from 'next'
import AboutHero from '@/components/about/AboutHero'
import AboutStory from '@/components/about/AboutStory'
import AboutValues from '@/components/about/AboutValues'
import AboutTeam from '@/components/about/AboutTeam'
import CTASection from '@/components/sections/CTASection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export const metadata: Metadata = {
  title: 'Tentang Kami - Perusahaan IT Solutions Indonesia',
  description: 'Hilal Technologic adalah perusahaan IT Solutions terpercaya di Indonesia. Pelajari cerita, misi, nilai-nilai, dan tim profesional kami yang berdedikasi untuk transformasi digital bisnis Anda.',
  keywords: ['Tentang Hilal Technologic', 'Perusahaan IT Indonesia', 'Tim IT Profesional', 'Software House Indonesia', 'IT Company Profile'],
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: 'Tentang Kami - Hilal Technologic',
    description: 'Pelajari lebih lanjut tentang Hilal Technologic - perusahaan IT Solutions terpercaya di Indonesia.',
    url: `${siteUrl}/about`,
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutTeam />
      <CTASection />
    </>
  )
}
