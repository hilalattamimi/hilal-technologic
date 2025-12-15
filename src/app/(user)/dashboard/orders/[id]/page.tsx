import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, MapPin, CreditCard, Truck } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Detail Pesanan',
  description: 'Lihat detail pesanan Anda',
}

interface Props {
  params: { id: string }
}

async function getOrder(orderId: string, userId: string) {
  return prisma.order.findFirst({
    where: { id: orderId, userId },
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

export default async function OrderDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard/orders')
  }

  const order = await getOrder(params.id, session.user.id)

  if (!order) {
    notFound()
  }

  const orderSteps = [
    { status: 'PENDING', label: 'Pesanan Dibuat', icon: Package },
    { status: 'PROCESSING', label: 'Diproses', icon: Package },
    { status: 'SHIPPED', label: 'Dikirim', icon: Truck },
    { status: 'DELIVERED', label: 'Selesai', icon: Package },
  ]

  const currentStepIndex = orderSteps.findIndex(step => step.status === order.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Pesanan #{order.orderNumber}</h1>
            <p className="text-muted-foreground">
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
        <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
          {getStatusLabel(order.status)}
        </Badge>
      </div>

      {/* Order Progress */}
      {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              {orderSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex
                return (
                  <div key={step.status} className="flex flex-col items-center flex-1">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-violet-500 text-white' : 'bg-muted text-muted-foreground'}
                      ${isCurrent ? 'ring-4 ring-violet-500/30' : ''}
                    `}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className={`text-sm mt-2 ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    {index < orderSteps.length - 1 && (
                      <div className={`
                        absolute h-1 w-full top-5 left-1/2
                        ${index < currentStepIndex ? 'bg-violet-500' : 'bg-muted'}
                      `} />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-violet-400" />
                Produk Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-lg bg-background">
                    <div className="w-20 h-20 rounded-lg bg-violet-500/20 overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0] ? (
                        <img 
                          src={item.product.images[0].url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-violet-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.name}</h4>
                      {item.sku && (
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                      <p className="text-sm text-muted-foreground">{formatPrice(item.price)} / item</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-violet-400" />
                Alamat Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.customerName}</p>
                <p className="text-muted-foreground">{order.customerPhone}</p>
                <p className="text-muted-foreground">{order.shippingAddress}</p>
                {(order.shippingCity || order.shippingState || order.shippingZip) && (
                  <p className="text-muted-foreground">
                    {[order.shippingCity, order.shippingState, order.shippingZip].filter(Boolean).join(', ')}
                  </p>
                )}
                <p className="text-muted-foreground">{order.shippingCountry}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-violet-400" />
                Ringkasan Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                {Number(order.tax) > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pajak</span>
                    <span>{formatPrice(order.tax)}</span>
                  </div>
                )}
                {Number(order.discount) > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Diskon</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-violet-400">{formatPrice(order.total)}</span>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status Pembayaran</span>
                  <span>{getPaymentStatusLabel(order.paymentStatus)}</span>
                </div>
                {order.paymentMethod && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Metode Pembayaran</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {order.notes && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle>Catatan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{order.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {order.status === 'DELIVERED' && (
            <Card className="bg-card/50 border-border">
              <CardContent className="py-4">
                <Link href={`/dashboard/reviews?orderId=${order.id}`}>
                  <Button className="w-full btn-primary">
                    Beri Ulasan
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
