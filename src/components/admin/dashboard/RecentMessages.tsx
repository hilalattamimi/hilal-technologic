import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, Mail } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

async function getRecentMessages() {
  return prisma.contactMessage.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      subject: true,
      status: true,
      createdAt: true,
    },
  })
}

const statusColors: Record<string, string> = {
  UNREAD: 'bg-red-500/10 text-red-500',
  READ: 'bg-blue-500/10 text-blue-500',
  REPLIED: 'bg-green-500/10 text-green-500',
  ARCHIVED: 'bg-gray-500/10 text-gray-500',
}

export default async function RecentMessages() {
  const messages = await getRecentMessages()

  return (
    <Card className="bg-card/50 border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Messages</CardTitle>
        <Link href="/admin/messages">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No messages yet</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Link
                key={message.id}
                href={`/admin/messages/${message.id}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Mail className="h-4 w-4 text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{message.name}</p>
                    <Badge className={statusColors[message.status]} variant="secondary">
                      {message.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {message.subject || message.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
