'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, ArrowRight, User, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  name: string
  slug: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  thumbnail: string | null
  category: Category | null
  author: string | null
  publishedAt: string | null
  createdAt: string
  isFeatured: boolean
}

function formatDate(dateString: string | null) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/public/blog')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts || [])
        setCategories(data.categories || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category?.id === activeCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    return matchesCategory && matchesSearch
  })

  return (
    <section className="section-padding pt-8">
      <div className="container-custom">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === 'All' ? 'default' : 'outline'}
              size="sm"
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
                size="sm"
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
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        )}

        {/* Blog Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden bg-card/50 border-border hover:border-violet-500/50 card-hover group h-full">
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-violet-950/30">
                          <span className="text-6xl font-bold text-violet-400/20">
                            {post.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <Badge className="absolute top-3 left-3 bg-violet-600/90 text-white border-0">
                        {post.category?.name || 'Uncategorized'}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        {post.author && (
                          <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            {post.author}
                          </span>
                        )}
                        <span className="text-violet-400 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all ml-auto">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
