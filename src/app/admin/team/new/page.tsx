import { Metadata } from 'next'
import TeamForm from '@/components/admin/team/TeamForm'

export const metadata: Metadata = {
  title: 'Add Team Member',
}

export default function NewTeamMemberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Team Member</h2>
        <p className="text-muted-foreground">Add a new team member</p>
      </div>

      <TeamForm />
    </div>
  )
}
