import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import DeleteButton from '@/components/admin/shared/DeleteButton'

export const metadata: Metadata = {
  title: 'Team',
}

async function getTeamMembers() {
  return prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  })
}

export default async function TeamAdminPage() {
  const members = await getTeamMembers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Members</h2>
          <p className="text-muted-foreground">Manage your team</p>
        </div>
        <Link href="/admin/team/new">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </Link>
      </div>

      {members.length === 0 ? (
        <Card className="bg-card/50 border-border">
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">No team members yet</p>
            <Link href="/admin/team/new">
              <Button>Add your first team member</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="bg-card/50 border-border">
              <CardContent className="p-6 text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={member.image || ''} alt={member.name} />
                  <AvatarFallback className="bg-violet-500/20 text-violet-400 text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-violet-400">{member.position}</p>
                <div className="mt-2">
                  {member.isActive ? (
                    <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-500/10 text-gray-500">Inactive</Badge>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/admin/team/${member.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Edit</Button>
                  </Link>
                  <DeleteButton 
                    id={member.id} 
                    endpoint="/api/admin/team" 
                    itemName="member" 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
