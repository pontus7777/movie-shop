import { Button } from '@/components/ui/button'

import { UserTable } from './_components/user-table'
import { UserStats } from './_components/user-stats'
import { FilterUsers } from './_components/user-filter'
import { getUserStats, getUsers } from './lib/queries'

type Props = {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
    status?: 'verified' | 'unverified'
  }>
}

export default async function UsersPage({ searchParams }: Props) {
  const { page, search, role, status } = await searchParams

  const currentPage = Number(page) || 1

  // Fetch both in parallel
  const [stats, usersData] = await Promise.all([
    getUserStats(),
    getUsers({
      page: currentPage,
      search,
      role,
      status,
    }),
  ])

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
      <UserStats
        totalUsers={stats.totalUsers}
        admins={stats.admins}
        verifiedUsers={stats.verifiedUsers}
        newUsers={stats.newUsers}
      />

      {/* Filters */}
      <FilterUsers />

      {/* Users Table */}
      <UserTable
        users={usersData.users}
        totalUsers={usersData.totalUsers}
        currentPage={usersData.currentPage}
        totalPages={usersData.totalPages}
      />
    </div>
  )
}
