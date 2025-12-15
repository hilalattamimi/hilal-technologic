'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
}

interface Portfolio {
  id: string
  title: string
  slug: string
  thumbnail: string | null
  category: Category | null
  technologies: string[]
  isFeatured: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function PortfolioSection() {
  const [portfolioItems, setPortfolioItems] = useState<Portfolio[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/portfolio')
      .then(res => res.json())
      .then(data => {
        // Only show first 4 featured items
        const items = (data.projects || []).slice(0, 4)
        setPortfolioItems(items)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-violet-400 font-medium mb-4 block">Our Portfolio</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Featured{' '}
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Explore our latest work and see how we&apos;ve helped businesses 
            achieve their digital goals.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        )}

        {/* Portfolio Grid */}
        {!isLoading && portfolioItems.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {portfolioItems.map((item) => (
              <motion.div key={item.id} variants={itemVariants}>
                <Link href={`/portfolio/${item.slug}`}>
                  <Card className="overflow-hidden bg-card/50 border-border hover:border-violet-500/50 card-hover group">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-violet-950/50">
                          <span className="text-4xl font-bold text-violet-400/30">
                            {item.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 right-4 z-20">
                        <Badge variant="secondary" className="mb-2 bg-violet-500/20 text-violet-300 border-0">
                          {item.category?.name || 'Uncategorized'}
                        </Badge>
                        <h3 className="text-xl font-semibold group-hover:text-violet-400 transition-colors">
                          {item.title}
                        </h3>
                      </div>
                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {item.technologies?.map((tech, techIndex) => (
                          <Badge 
                            key={techIndex} 
                            variant="outline" 
                            className="text-xs border-border text-muted-foreground"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && portfolioItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No portfolio projects available yet.</p>
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
          <Link href="/portfolio" className="btn-primary inline-flex items-center">
            View All Projects
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
