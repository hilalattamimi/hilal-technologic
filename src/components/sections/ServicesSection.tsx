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
  ArrowRight,
  Loader2,
  LucideIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Service {
  id: string
  title: string
  slug: string
  description: string | null
  icon: string | null
  isFeatured: boolean
}

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  Palette,
  Server,
  ShoppingCart,
  Headphones,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function ServicesSection() {
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
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet-950/5 to-background" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-violet-400 font-medium mb-4 block">Our Services</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Solutions That Drive{' '}
            <span className="gradient-text">Business Growth</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            We offer comprehensive IT services tailored to your business needs, 
            from development to deployment and beyond.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && services.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map((service) => {
              const IconComponent = service.icon ? iconMap[service.icon] || Code2 : Code2
              return (
                <motion.div key={service.id} variants={itemVariants}>
                  <Link href={`/services/${service.slug}`}>
                    <Card className="h-full bg-card/50 border-border hover:border-violet-500/50 card-hover group">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                          <IconComponent className="w-6 h-6 text-violet-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3 group-hover:text-violet-400 transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center text-violet-400 text-sm font-medium">
                          Learn More
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No services available yet.</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/services" className="btn-secondary inline-flex items-center">
            View All Services
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
