import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayersPlus, ShieldUser, UserCheck, Users } from 'lucide-react'

type Props = {
  totalUsers: number
  newUsers: number
  admins: number
  verifiedUsers?: number
}

export function StatsTable({ totalUsers, admins, verifiedUsers, newUsers }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center justify-between">
            <span>Total Users</span>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardDescription>

          <CardTitle className="text-3xl">{totalUsers}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center justify-between">
            <span>Administrators</span>
            <ShieldUser className="h-4 w-4 text-muted-foreground" />
          </CardDescription>

          <CardTitle className="text-3xl">{admins}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center justify-between">
            <span>Active Users</span>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-3xl">
            {/* {users.filter((u) => u.emailVerified).length} */}
            {verifiedUsers}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center justify-between">
            <span>New This Month</span>
            <LayersPlus className="h-4 w-4 text-muted-foreground" />
          </CardDescription>
          <CardTitle className="text-3xl">{newUsers}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
