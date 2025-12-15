import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import CTASection from '@/components/sections/CTASection'
import WishlistButton from '@/components/shared/WishlistButton'
import ProductReviews from '@/components/shared/ProductReviews'

interface Props {
  params: { slug: string }
}

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { order: 'asc' } },
    },
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  if (!product) return { title: 'Product Not Found' }
  
  return {
    title: product.name,
    description: product.description || `Buy ${product.name}`,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProduct(params.slug)

  if (!product) {
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

  const mainImage = product.images[0]?.url

  return (
    <>
      {/* Product Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
        
        <div className="container-custom relative z-10">
          <Link href="/products" className="inline-flex items-center text-violet-400 hover:text-violet-300 mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-violet-950/30">
                {mainImage ? (
                  <img 
                    src={mainImage} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-violet-400/30">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image) => (
                    <div key={image.id} className="aspect-square rounded-lg overflow-hidden bg-violet-950/30">
                      <img 
                        src={image.url} 
                        alt={image.alt || product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {product.category && (
                  <Badge className="bg-violet-500/20 text-violet-300 border-0">
                    {product.category.name}
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-0">
                    Featured
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge className="bg-red-500/20 text-red-300 border-0">
                    Out of Stock
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              
              {product.description && (
                <p className="text-lg text-muted-foreground mb-6 line-clamp-3">
                  {product.description}
                </p>
              )}
              
              {/* Price */}
              <div className="mb-8">
                {product.comparePrice ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold gradient-text">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold gradient-text">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
              
              {/* Stock Info */}
              {product.stock !== null && product.stock > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  {product.stock} items in stock
                </p>
              )}
              
              {/* Add to Cart */}
              <div className="flex gap-4 mb-8">
                <Link href="/contact" className="flex-1">
                  <Button className="btn-primary w-full text-lg py-6" disabled={product.stock === 0}>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? 'Out of Stock' : 'Order Now'}
                  </Button>
                </Link>
                <WishlistButton productId={product.id} />
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      {product.description && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">Product Description</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl">
            <ProductReviews productId={product.id} productSlug={product.slug} />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
