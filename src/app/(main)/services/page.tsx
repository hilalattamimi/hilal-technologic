import { Metadata } from 'next'
import ServicesHero from '@/components/services/ServicesHero'
import ServicesList from '@/components/services/ServicesList'
import ServicesProcess from '@/components/services/ServicesProcess'
import CTASection from '@/components/sections/CTASection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export const metadata: Metadata = {
  title: 'Layanan IT - Jasa Pembuatan Website & Aplikasi',
  description: 'Layanan IT profesional dari Hilal Technologic: Jasa pembuatan website, aplikasi mobile, UI/UX design, custom software, dan konsultasi IT. Solusi digital terbaik untuk bisnis Anda.',
  keywords: [
    'Jasa Pembuatan Website',
    'Jasa Pembuatan Aplikasi Mobile',
    'Jasa UI/UX Design',
    'Custom Software Development',
    'IT Consulting Indonesia',
    'Web Development Indonesia',
    'Mobile App Development',
    'Layanan IT Profesional',
  ],
  alternates: {
    canonical: `${siteUrl}/services`,
  },
  openGraph: {
    title: 'Layanan IT - Hilal Technologic',
    description: 'Jasa pembuatan website, aplikasi mobile, UI/UX design, dan konsultasi IT profesional.',
    url: `${siteUrl}/services`,
    type: 'website',
  },
}

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <ServicesProcess />
      <CTASection />
    </>
  )
}
