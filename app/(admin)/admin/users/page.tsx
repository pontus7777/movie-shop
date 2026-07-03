import { Button } from '@/components/ui/button'

import { UserTable } from './_components/user-table'
import { StatsTable } from './_components/user-stats'
import { FilterUsers } from './_components/user-filter'
import { getUsersDashboard } from './lib/queries'

type Props = {
  searchParams: Promise<{
    page?: string
  }>
}
export default async function UsersPage({ searchParams }: Props) {
  const { page } = await searchParams

  const currentPage = Number(page) || 1
  const data = await getUsersDashboard(currentPage)

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
      <StatsTable
        totalUsers={data.totalUsers}
        admins={data.admins}
        verifiedUsers={data.verifiedUsers}
        newUsers={data.newUsers}
      />

      {/* Filters */}
      <FilterUsers />

      {/* Users Table */}
      <UserTable
        users={data.users}
        totalUsers={data.totalUsers}
        admins={data.admins}
        verifiedUsers={data.verifiedUsers}
        newUsers={data.newUsers}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
      />
    </div>
  )
}
