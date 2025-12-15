import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, ExternalLink, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CTASection from '@/components/sections/CTASection'

interface Props {
  params: { slug: string }
}

async function getPortfolio(slug: string) {
  return prisma.portfolio.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const portfolio = await getPortfolio(params.slug)
  if (!portfolio) return { title: 'Project Not Found' }
  
  return {
    title: portfolio.title,
    description: portfolio.description || `View our ${portfolio.title} project`,
  }
}

export default async function PortfolioDetailPage({ params }: Props) {
  const portfolio = await getPortfolio(params.slug)

  if (!portfolio) {
    notFound()
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        
        <div className="container-custom relative z-10">
          <Link href="/portfolio" className="inline-flex items-center text-violet-400 hover:text-violet-300 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Portfolio
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {portfolio.category && (
                <Badge className="bg-violet-500/20 text-violet-300 border-0">
                  {portfolio.category.name}
                </Badge>
              )}
              {portfolio.isFeatured && (
                <Badge className="bg-yellow-500/20 text-yellow-300 border-0">
                  Featured
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {portfolio.title}
            </h1>
            
            {portfolio.description && (
              <p className="text-xl text-muted-foreground mb-8 line-clamp-3">
                {portfolio.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
              {portfolio.client && (
                <div>
                  <span className="text-foreground font-medium">Client:</span> {portfolio.client}
                </div>
              )}
              {portfolio.completedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(portfolio.completedAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </div>
              )}
            </div>
            
            {portfolio.projectUrl && (
              <a href={portfolio.projectUrl} target="_blank" rel="noopener noreferrer">
                <Button className="btn-primary">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Live Project
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Image */}
      {portfolio.thumbnail && (
        <section className="pb-12">
          <div className="container-custom">
            <div className="aspect-video rounded-xl overflow-hidden bg-violet-950/30">
              <img 
                src={portfolio.thumbnail} 
                alt={portfolio.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Description */}
            <div className="lg:col-span-2">
              {portfolio.description && (
                <>
                  <h2 className="text-2xl font-bold mb-6">About This Project</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {portfolio.description}
                    </p>
                  </div>
                </>
              )}
              
              {/* Gallery */}
              {portfolio.images.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Project Gallery</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolio.images.map((image) => (
                      <div key={image.id} className="aspect-video rounded-lg overflow-hidden bg-violet-950/30">
                        <img 
                          src={image.url} 
                          alt={image.alt || portfolio.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Technologies */}
              {portfolio.technologies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {portfolio.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="border-border text-muted-foreground"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Project Info */}
              <div className="p-6 rounded-xl bg-card/50 border border-border">
                <h3 className="text-lg font-semibold mb-4">Project Details</h3>
                <dl className="space-y-3 text-sm">
                  {portfolio.client && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Client</dt>
                      <dd className="font-medium">{portfolio.client}</dd>
                    </div>
                  )}
                  {portfolio.category && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium">{portfolio.category.name}</dd>
                    </div>
                  )}
                  {portfolio.completedAt && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Completed</dt>
                      <dd className="font-medium">
                        {new Date(portfolio.completedAt).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
