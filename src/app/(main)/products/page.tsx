import { Metadata } from 'next'
import ProductsHero from '@/components/products/ProductsHero'
import ProductsGrid from '@/components/products/ProductsGrid'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export const metadata: Metadata = {
  title: 'Produk Digital - Software & Template Premium',
  description: 'Jelajahi koleksi produk digital kami: template website, source code, plugin, dan software siap pakai. Solusi hemat untuk kebutuhan digital bisnis Anda.',
  keywords: [
    'Produk Digital',
    'Template Website',
    'Source Code',
    'Software Siap Pakai',
    'Plugin Premium',
    'Digital Products Indonesia',
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: 'Produk Digital - Hilal Technologic',
    description: 'Koleksi produk digital: template, source code, dan software siap pakai.',
    url: `${siteUrl}/products`,
    type: 'website',
  },
}

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <ProductsGrid />
    </>
  )
}
