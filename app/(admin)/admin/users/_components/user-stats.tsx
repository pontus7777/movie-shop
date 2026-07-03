import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Prisma } from '@/generated/prisma/client'

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    orders: true
  }
}>

type Props = {
  users: UserWithRelations[]
  totalUsers: number
  newUsers: number
  admins: number
  verifiedUsers?: number
}

export function StatsTable({ users, totalUsers, admins, verifiedUsers, newUsers }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Users</CardDescription>
          <CardTitle className="text-3xl">{totalUsers}</CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Administrators</CardDescription>
          <CardTitle className="text-3xl">
            {/* {users.filter((u) => u.role === 'ADMIN' || u.role === 'admin').length} */}
            {admins}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Users</CardDescription>
          <CardTitle className="text-3xl">
            {/* {users.filter((u) => u.emailVerified).length} */}
            {verifiedUsers}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>New This Month</CardDescription>
          <CardTitle className="text-3xl">{newUsers}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
