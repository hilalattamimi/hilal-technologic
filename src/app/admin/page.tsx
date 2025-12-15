import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { 
  Package, 
  ShoppingCart, 
  MessageSquare,
  FileText
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import RecentOrders from '@/components/admin/dashboard/RecentOrders'
import RecentMessages from '@/components/admin/dashboard/RecentMessages'

export const metadata: Metadata = {
  title: 'Dashboard',
}

async function getStats() {
  const [
    productsCount,
    ordersCount,
    messagesCount,
    blogPostsCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
  ])

  return {
    productsCount,
    ordersCount,
    messagesCount,
    blogPostsCount,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    {
      title: 'Total Products',
      value: stats.productsCount,
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Orders',
      value: stats.ordersCount,
      icon: ShoppingCart,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Unread Messages',
      value: stats.messagesCount,
      icon: MessageSquare,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Published Posts',
      value: stats.blogPostsCount,
      icon: FileText,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your site.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <RecentMessages />
      </div>
    </div>
  )
}
