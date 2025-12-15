'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ExternalLink, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Category {
  id: string
  name: string
  slug: string
}

interface PortfolioImage {
  id: string
  url: string
}

interface Portfolio {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail: string | null
  category: Category | null
  technologies: string[]
  images: PortfolioImage[]
  isFeatured: boolean
}

export default function PortfolioGrid() {
  const [projects, setProjects] = useState<Portfolio[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/public/portfolio')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || [])
        setCategories(data.categories || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filteredItems = activeCategory === 'All'
    ? projects
    : projects.filter(item => item.category?.id === activeCategory)

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <Button
            variant={activeCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setActiveCategory('All')}
            className={activeCategory === 'All' 
              ? 'bg-violet-600 hover:bg-violet-700' 
              : 'hover:bg-violet-500/10 hover:border-violet-500/50'
            }
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.id)}
              className={activeCategory === category.id 
                ? 'bg-violet-600 hover:bg-violet-700' 
                : 'hover:bg-violet-500/10 hover:border-violet-500/50'
              }
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        )}

        {/* Portfolio Grid */}
        {!isLoading && (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/portfolio/${item.slug}`}>
                    <Card className="overflow-hidden bg-card/50 border-border hover:border-violet-500/50 card-hover group h-full">
                      <div className="relative aspect-video overflow-hidden bg-muted">
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10" />
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-violet-950/50">
                            <span className="text-6xl font-bold text-violet-400/20">
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
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {item.description}
                        </p>
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
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No portfolio projects found.</p>
          </div>
        )}
      </div>
    </section>
  )
}
