import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CTASection from '@/components/sections/CTASection'

interface Props {
  params: { slug: string }
}

async function getService(slug: string) {
  return prisma.service.findUnique({
    where: { slug, isActive: true },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params.slug)
  if (!service) return { title: 'Service Not Found' }
  
  return {
    title: service.title,
    description: service.description || `Learn more about our ${service.title} service`,
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const service = await getService(params.slug)

  if (!service) {
    notFound()
  }

  const formatPrice = (price: number | { toNumber?: () => number } | null) => {
    if (!price) return null
    const numPrice = typeof price === 'number' ? price : (price.toNumber ? price.toNumber() : Number(price))
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numPrice)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        
        <div className="container-custom relative z-10">
          <Link href="/services" className="inline-flex items-center text-violet-400 hover:text-violet-300 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          
          <div className="max-w-4xl">
            {service.isFeatured && (
              <Badge className="bg-violet-500/20 text-violet-300 border-0 mb-4">
                Featured Service
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {service.title}
            </h1>
            {service.description && (
              <p className="text-xl text-muted-foreground mb-8">
                {service.description}
              </p>
            )}
            
            {service.price && (
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-3xl font-bold gradient-text">
                  {formatPrice(service.price)}
                </span>
                {service.priceUnit && (
                  <span className="text-muted-foreground">{service.priceUnit}</span>
                )}
              </div>
            )}
            
            <Link href="/contact">
              <Button className="btn-primary text-lg px-8 py-6">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Section */}
      {(service.content || service.features.length > 0) && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Description */}
              {service.content && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">About This Service</h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {service.content}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Features */}
              {service.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">What&apos;s Included</h2>
                  <ul className="space-y-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4 text-violet-400" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  )
}
