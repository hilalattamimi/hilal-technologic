import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Script from 'next/script'
import { ArrowLeft, Calendar, Clock, Tag, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import CTASection from '@/components/sections/CTASection'
import BlogContent from '@/components/blog/BlogContent'
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo'

interface Props {
  params: { slug: string }
}

async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      tags: true,
    },
  })
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPost(params.slug)
  if (!post) return { title: 'Post Not Found' }
  
  const title = post.metaTitle || post.title
  const description = post.metaDescription || post.excerpt || `Baca artikel ${post.title} di blog Hilal Technologic`
  const imageUrl = post.ogImage || post.thumbnail || '/og-image.png'
  
  return {
    title,
    description,
    keywords: post.metaKeywords || undefined,
    authors: [{ name: post.author || 'Hilal Technologic' }],
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author || 'Hilal Technologic'],
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil((post.content?.split(' ').length || 0) / 200)

  // Generate structured data
  const articleSchema = generateArticleSchema({
    title: post.title,
    description: post.excerpt || post.title,
    slug: post.slug,
    author: post.author || 'Hilal Technologic',
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    thumbnail: post.thumbnail,
    category: post.category,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` },
  ])

  return (
    <>
      {/* Structured Data */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        
        <div className="container-custom relative z-10">
          <Link href="/blog" className="inline-flex items-center text-violet-400 hover:text-violet-300 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.category && (
                <Badge className="bg-violet-500/20 text-violet-300 border-0">
                  {post.category.name}
                </Badge>
              )}
              {post.isFeatured && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-8">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              {post.author && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author}
                </div>
              )}
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.thumbnail && (
        <section className="pb-12">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="aspect-video rounded-xl overflow-hidden bg-violet-950/30">
                <img 
                  src={post.thumbnail} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="max-w-4xl">
            <BlogContent content={post.content || ''} />
            
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {post.tags.map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className="border-border text-muted-foreground"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
