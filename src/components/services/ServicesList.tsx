'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  Code2, 
  Smartphone, 
  Palette, 
  Server, 
  ShoppingCart, 
  Headphones,
  Database,
  Cloud,
  Shield,
  ArrowRight,
  Check,
  Loader2,
  LucideIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Service {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  price: number | null
  priceUnit: string | null
  features: string[]
  isFeatured: boolean
}

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  Palette,
  Server,
  ShoppingCart,
  Headphones,
  Database,
  Cloud,
  Shield,
}

const formatPrice = (price: number | null, priceUnit: string | null) => {
  if (!price) return null
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
  return `Starting from ${formatted}${priceUnit || ''}`
}

export default function ServicesList() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/services')
      .then(res => res.json())
      .then(data => {
        setServices(data.services || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <section className="section-padding">
        <div className="container-custom flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section className="section-padding">
        <div className="container-custom text-center py-12">
          <p className="text-muted-foreground">No services available yet.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = service.icon ? iconMap[service.icon] || Code2 : Code2
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="h-full bg-card/50 border-border hover:border-violet-500/50 card-hover group">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                      <IconComponent className="w-6 h-6 text-violet-400" />
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-violet-400 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    
                    {service.features.length > 0 && (
                      <ul className="space-y-2 mb-6 flex-grow">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-violet-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="pt-4 border-t border-border mt-auto">
                      {service.price && (
                        <p className="text-sm text-violet-400 font-medium mb-3">
                          {formatPrice(service.price, service.priceUnit)}
                        </p>
                      )}
                      <Link href={`/services/${service.slug}`}>
                        <Button variant="outline" className="w-full group-hover:bg-violet-500/10 group-hover:border-violet-500/50">
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
