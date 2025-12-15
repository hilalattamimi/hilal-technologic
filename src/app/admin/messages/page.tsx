import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import MessagesTable from '@/components/admin/messages/MessagesTable'

export const metadata: Metadata = {
  title: 'Messages',
}

async function getMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function MessagesPage() {
  const messages = await getMessages()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-muted-foreground">View and manage contact form submissions</p>
      </div>

      <Card className="bg-card/50 border-border">
        <CardContent className="pt-6">
          <MessagesTable messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}
