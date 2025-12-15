import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Package, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Pesanan Saya',
  description: 'Lihat riwayat pesanan Anda',
}

async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            include: { images: { take: 1 } }
          }
        }
      }
    }
  })
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
    case 'REFUNDED': return 'bg-orange-500/20 text-orange-400'
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
    case 'REFUNDED': return 'Dikembalikan'
    default: return status
  }
}

function getPaymentStatusColor(status: string) {
  switch (status) {
    case 'UNPAID': return 'bg-red-500/20 text-red-400'
    case 'PENDING': return 'bg-yellow-500/20 text-yellow-400'
    case 'PAID': return 'bg-green-500/20 text-green-400'
    case 'FAILED': return 'bg-red-500/20 text-red-400'
    case 'REFUNDED': return 'bg-orange-500/20 text-orange-400'
    default: return 'bg-gray-500/20 text-gray-400'
  }
}

function getPaymentStatusLabel(status: string) {
  switch (status) {
    case 'UNPAID': return 'Belum Bayar'
    case 'PENDING': return 'Menunggu Konfirmasi'
    case 'PAID': return 'Lunas'
    case 'FAILED': return 'Gagal'
    case 'REFUNDED': return 'Dikembalikan'
    default: return status
  }
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/orders')
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pesanan Saya</h1>
          <p className="text-muted-foreground">Riwayat semua pesanan Anda</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Pesanan</h3>
            <p className="text-muted-foreground mb-4">Anda belum memiliki pesanan. Mulai belanja sekarang!</p>
            <Link href="/products">
              <Button className="btn-primary">Jelajahi Produk</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="bg-card/50 border-border hover:border-violet-500/30 transition-colors">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-violet-500/20">
                      <Package className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-semibold">#{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center gap-4 py-4 border-t border-b border-border">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div 
                        key={item.id} 
                        className="w-12 h-12 rounded-lg bg-violet-500/20 border-2 border-background overflow-hidden"
                        style={{ zIndex: 3 - index }}
                      >
                        {item.product?.images?.[0] ? (
                          <img 
                            src={item.product.images[0].url} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-violet-400" />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded-lg bg-violet-500/20 border-2 border-background flex items-center justify-center text-sm font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      {order.items.slice(0, 2).map(item => item.name).join(', ')}
                      {order.items.length > 2 && ` dan ${order.items.length - 2} lainnya`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} item
                    </p>
                  </div>
                </div>

                {/* Order Total & Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                    <p className="text-xl font-bold text-violet-400">{formatPrice(order.total)}</p>
                  </div>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
