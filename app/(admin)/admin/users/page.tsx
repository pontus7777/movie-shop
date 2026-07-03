import { Button } from '@/components/ui/button'

import { UserTable } from './_components/user-table'
import { StatsTable } from './_components/user-stats'
import { FilterUsers } from './_components/user-filter'
import prisma from '@/lib/prisma'

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: true,
    },
  })
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your customers and administrators.</p>
        </div>

        <Button>Add User</Button>
      </div>

      {/* Stats */}
      <StatsTable />

      {/* Filters */}
      <FilterUsers />

      {/* Users Table */}
      <UserTable users={users} />
    </div>
  )
}
