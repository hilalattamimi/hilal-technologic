'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Star, User, Loader2, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Link from 'next/link'

interface Review {
  id: string
  rating: number
  title: string | null
  content: string | null
  isVerified: boolean
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
}

interface ProductReviewsProps {
  productId: string
  productSlug: string
}

function StarRating({ rating, interactive = false, onRate }: { 
  rating: number
  interactive?: boolean
  onRate?: (rating: number) => void 
}) {
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={interactive ? 'cursor-pointer' : 'cursor-default'}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onRate?.(star)}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hoverRating || rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

export default function ProductReviews({ productId, productSlug }: ProductReviewsProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
  })

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productSlug}/reviews`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews || [])
        
        // Check if current user has already reviewed
        if (session?.user?.id) {
          const userReview = data.reviews?.find((r: { userId: string }) => r.userId === session.user.id)
          setHasReviewed(!!userReview)
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user) {
      toast.error('Silakan login untuk memberikan ulasan')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/user/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      })

      if (response.ok) {
        toast.success('Ulasan berhasil dikirim! Menunggu persetujuan admin.')
        setShowForm(false)
        setFormData({ rating: 5, title: '', content: '' })
        setHasReviewed(true)
        fetchReviews()
      } else {
        const data = await response.json()
        toast.error(data.error || 'Gagal mengirim ulasan')
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Ulasan Produk</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length} ulasan)</span>
          </div>
        </div>
        
        {session?.user && !hasReviewed && !showForm && (
          <Button onClick={() => setShowForm(true)} className="btn-primary">
            Tulis Ulasan
          </Button>
        )}
        
        {!session?.user && (
          <Link href={`/auth/login?callbackUrl=/products/${productSlug}`}>
            <Button variant="outline">Login untuk Ulasan</Button>
          </Link>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle>Tulis Ulasan Anda</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Rating</Label>
                <StarRating 
                  rating={formData.rating} 
                  interactive 
                  onRate={(rating) => setFormData({ ...formData, rating })} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Judul (opsional)</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-background"
                  placeholder="Ringkasan ulasan Anda"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Ulasan</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-background"
                  rows={4}
                  placeholder="Bagikan pengalaman Anda dengan produk ini..."
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    'Kirim Ulasan'
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
        </div>
      ) : reviews.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Belum ada ulasan untuk produk ini</p>
            {session?.user && !hasReviewed && (
              <Button onClick={() => setShowForm(true)} className="mt-4 btn-primary">
                Jadilah yang pertama mengulas
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="bg-card/50 border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                    {review.user.image ? (
                      <img 
                        src={review.user.image} 
                        alt={review.user.name || ''} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-violet-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{review.user.name || 'Anonymous'}</span>
                      {review.isVerified && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Pembeli Terverifikasi
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    
                    {review.title && (
                      <h4 className="font-medium mt-3">{review.title}</h4>
                    )}
                    {review.content && (
                      <p className="text-muted-foreground mt-1">{review.content}</p>
                    )}
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
