'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { UserTable } from './user-table'
import { UserStats } from './user-stats'
import { FilterUsers } from './user-filter'
import { CreateUserDialog } from './create-user-dialog'

export function UsersPageClient({ stats, usersData }: { stats: any; usersData: any }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage your customers and administrators.</p>
        </div>

        <Button onClick={() => setOpen(true)}>Add User</Button>
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

      {/* Dialog */}
      <CreateUserDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
