'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
  productId: string
  variant?: 'default' | 'icon'
  className?: string
}

export default function WishlistButton({ productId, variant = 'default', className }: WishlistButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (session?.user) {
      checkWishlistStatus()
    } else {
      setIsChecking(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, productId])

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch('/api/user/wishlist')
      if (response.ok) {
        const data = await response.json()
        const inWishlist = data.items?.some((item: { productId: string }) => item.productId === productId)
        setIsInWishlist(inWishlist)
      }
    } catch (error) {
      console.error('Error checking wishlist:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const toggleWishlist = async () => {
    if (!session?.user) {
      router.push('/auth/login?callbackUrl=' + window.location.pathname)
      return
    }

    setIsLoading(true)

    try {
      if (isInWishlist) {
        // Get wishlist item ID first
        const wishlistResponse = await fetch('/api/user/wishlist')
        const wishlistData = await wishlistResponse.json()
        const item = wishlistData.items?.find((i: { id: string; productId: string }) => i.productId === productId)
        
        if (item) {
          const response = await fetch(`/api/user/wishlist/${item.id}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            setIsInWishlist(false)
            toast.success('Dihapus dari wishlist')
          } else {
            toast.error('Gagal menghapus dari wishlist')
          }
        }
      } else {
        const response = await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        })

        if (response.ok) {
          setIsInWishlist(true)
          toast.success('Ditambahkan ke wishlist')
        } else {
          const data = await response.json()
          toast.error(data.error || 'Gagal menambahkan ke wishlist')
        }
      }
    } catch {
      toast.error('Terjadi kesalahan')
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'rounded-full',
          isInWishlist ? 'text-pink-500 hover:text-pink-400' : 'text-muted-foreground hover:text-foreground',
          className
        )}
        onClick={toggleWishlist}
        disabled={isLoading || isChecking}
      >
        {isLoading || isChecking ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Heart className={cn('w-5 h-5', isInWishlist && 'fill-current')} />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      className={cn(
        isInWishlist ? 'text-pink-500 border-pink-500/50 hover:bg-pink-500/10' : '',
        className
      )}
      onClick={toggleWishlist}
      disabled={isLoading || isChecking}
    >
      {isLoading || isChecking ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Heart className={cn('w-4 h-4 mr-2', isInWishlist && 'fill-current')} />
      )}
      {isInWishlist ? 'Di Wishlist' : 'Wishlist'}
    </Button>
  )
}
