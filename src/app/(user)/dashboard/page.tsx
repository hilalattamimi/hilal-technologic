import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Heart, Star, ShoppingBag, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Kelola akun dan pesanan Anda di Hilal Technologic',
}

async function getUserStats(userId: string) {
  const [ordersCount, wishlistCount, reviewsCount, recentOrders] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.wishlistItem.count({ 
      where: { wishlist: { userId } } 
    }),
    prisma.productReview.count({ where: { userId } }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        items: {
          include: { 
            product: {
              include: {
                images: { take: 1, orderBy: { order: 'asc' } }
              }
            } 
          },
          take: 1,
        },
      },
    }),
  ])

  return { ordersCount, wishlistCount, reviewsCount, recentOrders }
}

function formatPrice(price: number | { toNumber?: () => number } | null | undefined) {
  if (price === null || price === undefined) return 'Rp 0'
  const numPrice = typeof price === 'number' ? price : (price.toNumber ? price.toNumber() : Number(price))
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(numPrice)
}

function getStatusColor(status: string) {
  switch (status) {
    case 'PENDING': return 'bg-yellow-500/20 text-yellow-400'
    case 'PROCESSING': return 'bg-blue-500/20 text-blue-400'
    case 'SHIPPED': return 'bg-purple-500/20 text-purple-400'
    case 'DELIVERED': return 'bg-green-500/20 text-green-400'
    case 'CANCELLED': return 'bg-red-500/20 text-red-400'
    default: return 'bg-gray-500/20 text-gray-400'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'PENDING': return 'Menunggu'
    case 'PROCESSING': return 'Diproses'
    case 'SHIPPED': return 'Dikirim'
    case 'DELIVERED': return 'Selesai'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard')
  }

  const { ordersCount, wishlistCount, reviewsCount, recentOrders } = await getUserStats(session.user.id)

  const stats = [
    {
      title: 'Total Pesanan',
      value: ordersCount,
      icon: Package,
      href: '/dashboard/orders',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Wishlist',
      value: wishlistCount,
      icon: Heart,
      href: '/dashboard/wishlist',
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
    },
    {
      title: 'Ulasan',
      value: reviewsCount,
      icon: Star,
      href: '/dashboard/reviews',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">Selamat Datang, {session.user.name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-muted-foreground">Kelola pesanan dan akun Anda di sini.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="bg-card/50 border-border hover:border-violet-500/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-card/50 border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pesanan Terbaru</CardTitle>
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300">
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada pesanan</p>
              <Link href="/products">
                <Button className="mt-4 btn-primary">
                  Mulai Belanja
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link 
                  key={order.id} 
                  href={`/dashboard/orders/${order.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background hover:bg-violet-500/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center">
                        {order.items[0]?.product?.images?.[0] ? (
                          <img 
                            src={order.items[0].product.images[0].url} 
                            alt="" 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-violet-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusLabel(order.status)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-violet-500/20">
                <ShoppingBag className="w-6 h-6 text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Jelajahi Produk</h3>
                <p className="text-sm text-muted-foreground">Temukan produk digital terbaik</p>
              </div>
              <Link href="/products">
                <Button variant="outline" size="sm">
                  Lihat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-pink-500/20">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Wishlist Anda</h3>
                <p className="text-sm text-muted-foreground">{wishlistCount} produk tersimpan</p>
              </div>
              <Link href="/dashboard/wishlist">
                <Button variant="outline" size="sm">
                  Lihat
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
