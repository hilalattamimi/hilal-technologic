'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { MoreHorizontal, Eye, Trash2, Mail, Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  createdAt: Date
}

interface MessagesTableProps {
  messages: Message[]
}

const statusColors: Record<string, string> = {
  UNREAD: 'bg-red-500/10 text-red-500',
  READ: 'bg-blue-500/10 text-blue-500',
  REPLIED: 'bg-green-500/10 text-green-500',
  ARCHIVED: 'bg-gray-500/10 text-gray-500',
}

export default function MessagesTable({ messages }: MessagesTableProps) {
  const router = useRouter()
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success('Status updated')
        router.refresh()
      } else {
        toast.error('Failed to update status')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const deleteMessage = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Message deleted')
        router.refresh()
      } else {
        toast.error('Failed to delete message')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  const viewMessage = (message: Message) => {
    setSelectedMessage(message)
    if (message.status === 'UNREAD') {
      updateStatus(message.id, 'READ')
    }
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow 
              key={message.id} 
              className={message.status === 'UNREAD' ? 'bg-violet-500/5' : ''}
            >
              <TableCell>
                <div>
                  <p className={`font-medium ${message.status === 'UNREAD' ? 'text-white' : ''}`}>
                    {message.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{message.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="truncate max-w-[200px]">
                  {message.subject || message.message.substring(0, 50)}
                </p>
              </TableCell>
              <TableCell>
                <Badge className={statusColors[message.status]}>
                  {message.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => viewMessage(message)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(message.id, 'REPLIED')}>
                      <Mail className="mr-2 h-4 w-4" />
                      Mark as Replied
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateStatus(message.id, 'ARCHIVED')}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500"
                      onClick={() => deleteMessage(message.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedMessage.phone}</p>
                  </div>
                )}
                {selectedMessage.subject && (
                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-medium">{selectedMessage.subject}</p>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <div className="p-4 rounded-lg bg-background border border-border">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`mailto:${selectedMessage.email}`}>
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Reply via Email
                  </Button>
                </a>
                {selectedMessage.phone && (
                  <a href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`} target="_blank">
                    <Button variant="outline">
                      Reply via WhatsApp
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
