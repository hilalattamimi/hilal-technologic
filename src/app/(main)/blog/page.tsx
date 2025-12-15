import { Metadata } from 'next'
import BlogHero from '@/components/blog/BlogHero'
import BlogGrid from '@/components/blog/BlogGrid'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export const metadata: Metadata = {
  title: 'Blog - Artikel Teknologi & Tips Digital',
  description: 'Baca artikel terbaru tentang teknologi, tips pembuatan website, pengembangan aplikasi, dan transformasi digital. Insight dari tim IT profesional Hilal Technologic.',
  keywords: [
    'Blog Teknologi',
    'Artikel IT',
    'Tips Web Development',
    'Tutorial Programming',
    'Digital Transformation',
    'Tech News Indonesia',
  ],
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'Blog - Hilal Technologic',
    description: 'Artikel terbaru tentang teknologi dan transformasi digital.',
    url: `${siteUrl}/blog`,
    type: 'website',
  },
}

export default function BlogPage() {
  return (
    <>
      <BlogHero />
      <BlogGrid />
    </>
  )
}
