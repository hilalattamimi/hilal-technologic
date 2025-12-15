// SEO utility functions and structured data generators

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

// Article Schema for Blog Posts
export function generateArticleSchema(post: {
  title: string
  description: string
  slug: string
  author: string
  publishedAt: Date | null
  updatedAt: Date
  thumbnail: string | null
  category?: { name: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.thumbnail || `${siteUrl}/og-image.png`,
    author: {
      '@type': 'Person',
      name: post.author || 'Hilal Technologic',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Hilal Technologic',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category?.name || 'Technology',
  }
}

// Service Schema
export function generateServiceSchema(service: {
  name: string
  description: string
  slug: string
  icon?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'Hilal Technologic',
      url: siteUrl,
    },
    url: `${siteUrl}/services/${service.slug}`,
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
  }
}

// Product Schema
export function generateProductSchema(product: {
  name: string
  description: string
  slug: string
  price: number
  image: string | null
  category?: { name: string } | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image || `${siteUrl}/og-image.png`,
    url: `${siteUrl}/products/${product.slug}`,
    brand: {
      '@type': 'Organization',
      name: 'Hilal Technologic',
    },
    category: product.category?.name || 'Digital Product',
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Hilal Technologic',
      },
    },
  }
}

// Breadcrumb Schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  }
}

// FAQ Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Local Business Schema (if applicable)
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Hilal Technologic',
    description: 'Perusahaan IT Solutions terkemuka di Indonesia yang menyediakan jasa pembuatan website, aplikasi mobile, dan software custom.',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/og-image.png`,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ID',
      addressLocality: 'Indonesia',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-6.2088',
      longitude: '106.8456',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/hilaltechnologic',
      'https://www.instagram.com/hilaltechnologic',
      'https://www.linkedin.com/company/hilaltechnologic',
      'https://twitter.com/hilaltechnologic',
    ],
  }
}
