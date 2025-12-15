import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TeamForm from '@/components/admin/team/TeamForm'

export const metadata: Metadata = {
  title: 'Edit Team Member',
}

async function getTeamMember(id: string) {
  return prisma.teamMember.findUnique({
    where: { id },
  })
}

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const member = await getTeamMember(params.id)

  if (!member) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Edit Team Member</h2>
        <p className="text-muted-foreground">Update team member details</p>
      </div>

      <TeamForm member={member} />
    </div>
  )
}
