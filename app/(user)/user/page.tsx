import prisma from '@/lib/prisma'

import { UserProfile } from './_components/user-profile'
import { UserOrderList } from './_components/user-order-list'
import { DeleteUserAccountButton } from './_components/delete-account-button'
import { requireAuth } from '@/lib/session-validation'

export default async function UserPage() {
  const session = await requireAuth()

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          movie: true,
        },
      },
      shippingAddress: true,
    },
  })

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{session.user.name} Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your profile, view your orders, and control your account.
        </p>
      </div>

      {/* Profile Card */}
      <UserProfile user={session.user} />

      {/* Orders */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Orders</h2>
        <UserOrderList orders={orders} />
      </div>

      {/* Danger Zone */}
      <div className="border-t pt-6">
        <h2 className="text-destructive text-xl font-semibold">Danger Zone</h2>
        <p className="text-muted-foreground mb-4">
          Permanently delete your account and all associated data.
        </p>
        <DeleteUserAccountButton variant="destructive" />
      </div>
    </div>
  )
}
