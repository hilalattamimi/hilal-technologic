'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Star, Package, Loader2, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Review {
  id: string
  productId: string
  rating: number
  title: string | null
  content: string | null
  isApproved: boolean
  createdAt: string
  product: {
    id: string
    name: string
    slug: string
    images: { url: string }[]
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/user/reviews')
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteReview = async (reviewId: string) => {
    setDeletingId(reviewId)
    try {
      const response = await fetch(`/api/user/reviews/${reviewId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId))
        toast.success('Ulasan berhasil dihapus')
      } else {
        toast.error('Gagal menghapus ulasan')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setDeletingId(null)
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
        <h1 className="text-2xl font-bold">Ulasan Saya</h1>
        <p className="text-muted-foreground">Ulasan yang telah Anda berikan untuk produk</p>
      </div>

      {reviews.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Ulasan</h3>
            <p className="text-muted-foreground mb-4">Anda belum memberikan ulasan untuk produk apapun</p>
            <Link href="/dashboard/orders">
              <Button className="btn-primary">Lihat Pesanan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <Link href={`/products/${review.product.slug}`} className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg bg-violet-500/20 overflow-hidden">
                      {review.product.images?.[0] ? (
                        <img 
                          src={review.product.images[0].url} 
                          alt={review.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-violet-400" />
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link href={`/products/${review.product.slug}`}>
                          <h3 className="font-medium hover:text-violet-400 transition-colors">
                            {review.product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={review.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {review.isApproved ? 'Dipublikasikan' : 'Menunggu Review'}
                        </Badge>
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-medium mt-3">{review.title}</h4>
                    )}
                    {review.content && (
                      <p className="text-muted-foreground mt-1">{review.content}</p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4">
                      <Link href={`/dashboard/reviews/${review.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => deleteReview(review.id)}
                        disabled={deletingId === review.id}
                      >
                        {deletingId === review.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Hapus
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
