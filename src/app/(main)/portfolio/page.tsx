import { Metadata } from 'next'
import PortfolioHero from '@/components/portfolio/PortfolioHero'
import PortfolioGrid from '@/components/portfolio/PortfolioGrid'
import CTASection from '@/components/sections/CTASection'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export const metadata: Metadata = {
  title: 'Portfolio - Proyek Website & Aplikasi Kami',
  description: 'Lihat portfolio proyek website, aplikasi mobile, dan software yang telah kami kerjakan. Bukti nyata kualitas layanan IT Hilal Technologic untuk berbagai industri.',
  keywords: [
    'Portfolio IT',
    'Contoh Website',
    'Proyek Aplikasi Mobile',
    'Case Study IT',
    'Portfolio Software House',
    'Hasil Kerja Web Developer',
  ],
  alternates: {
    canonical: `${siteUrl}/portfolio`,
  },
  openGraph: {
    title: 'Portfolio - Hilal Technologic',
    description: 'Lihat portfolio proyek website dan aplikasi yang telah kami kerjakan.',
    url: `${siteUrl}/portfolio`,
    type: 'website',
  },
}

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <PortfolioGrid />
      <CTASection />
    </>
  )
}
