'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Heart, Trash2, ShoppingCart, Loader2, Package } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    images: { url: string }[]
    isActive: boolean
    stock: number
  }
  createdAt: string
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price)
}

export default function WishlistPage() {
  const { data: session } = useSession()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/user/wishlist')
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWishlist = async (itemId: string) => {
    setRemovingId(itemId)
    try {
      const response = await fetch(`/api/user/wishlist/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setItems(items.filter(item => item.id !== itemId))
        toast.success('Produk dihapus dari wishlist')
      } else {
        toast.error('Gagal menghapus dari wishlist')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    } finally {
      setRemovingId(null)
    }
  }

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      })

      if (response.ok) {
        toast.success('Produk ditambahkan ke keranjang')
      } else {
        toast.error('Gagal menambahkan ke keranjang')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist Saya</h1>
        <p className="text-muted-foreground">Produk yang Anda simpan untuk nanti</p>
      </div>

      {items.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Wishlist Kosong</h3>
            <p className="text-muted-foreground mb-4">Simpan produk favorit Anda untuk dibeli nanti</p>
            <Link href="/products">
              <Button className="btn-primary">Jelajahi Produk</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="bg-card/50 border-border overflow-hidden">
              <div className="flex">
                {/* Product Image */}
                <Link href={`/products/${item.product.slug}`} className="flex-shrink-0">
                  <div className="w-32 h-32 bg-violet-500/20">
                    {item.product.images?.[0] ? (
                      <img 
                        src={item.product.images[0].url} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-violet-400" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex-1 p-4 flex flex-col">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium hover:text-violet-400 transition-colors line-clamp-2">
                      {item.product.name}
                    </h3>
                  </Link>
                  
                  <div className="mt-2">
                    <p className="text-lg font-bold text-violet-400">
                      {formatPrice(Number(item.product.price))}
                    </p>
                    {item.product.comparePrice && Number(item.product.comparePrice) > Number(item.product.price) && (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(Number(item.product.comparePrice))}
                      </p>
                    )}
                  </div>

                  {/* Stock Status */}
                  {!item.product.isActive ? (
                    <p className="text-sm text-red-400 mt-1">Produk tidak tersedia</p>
                  ) : item.product.stock === 0 ? (
                    <p className="text-sm text-red-400 mt-1">Stok habis</p>
                  ) : item.product.stock < 5 ? (
                    <p className="text-sm text-yellow-400 mt-1">Sisa {item.product.stock} item</p>
                  ) : null}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-2">
                    <Button
                      size="sm"
                      className="btn-primary flex-1"
                      disabled={!item.product.isActive || item.product.stock === 0}
                      onClick={() => addToCart(item.product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Keranjang
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removeFromWishlist(item.id)}
                      disabled={removingId === item.id}
                    >
                      {removingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
