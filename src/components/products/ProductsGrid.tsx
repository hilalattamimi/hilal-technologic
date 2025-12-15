'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ShoppingCart, Heart, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductImage {
  id: string
  url: string
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number | { toNumber?: () => number }
  comparePrice: number | { toNumber?: () => number } | null
  category: Category | null
  images: ProductImage[]
  isFeatured: boolean
  stock: number
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

function getPrice(price: number | { toNumber?: () => number } | null): number {
  if (price === null) return 0
  if (typeof price === 'number') return price
  if (typeof price === 'object' && price.toNumber) return price.toNumber()
  return Number(price) || 0
}

export default function ProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/public/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || [])
        setCategories(data.categories || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category?.id === activeCategory
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return getPrice(a.price) - getPrice(b.price)
        case 'price-high':
          return getPrice(b.price) - getPrice(a.price)
        default:
          return 0
      }
    })

  return (
    <section className="section-padding pt-8">
      <div className="container-custom">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border"
            />
          </div>
          <div className="flex gap-2">
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-[150px] bg-card border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px] bg-card border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden bg-card/50 border-border hover:border-violet-500/50 card-hover group h-full">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-violet-950/30">
                        <span className="text-6xl font-bold text-violet-400/20">
                          {product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {product.isFeatured && (
                      <Badge className="absolute top-3 left-3 bg-violet-600 text-white border-0">
                        Featured
                      </Badge>
                    )}
                    <button className="absolute top-3 right-3 p-2 rounded-full bg-background/80 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                      <Heart className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button className="w-full btn-primary" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-xs text-violet-400 mb-1">{product.category?.name || 'Uncategorized'}</p>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="font-semibold mb-2 group-hover:text-violet-400 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-violet-400">
                        {formatPrice(getPrice(product.price))}
                      </span>
                      {product.comparePrice && getPrice(product.comparePrice) > 0 && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(getPrice(product.comparePrice))}
                        </span>
                      )}
                    </div>
                    {product.stock <= 0 && (
                      <p className="text-xs text-red-500 mt-1">Out of Stock</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
