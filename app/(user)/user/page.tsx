import { requireSignedIn } from '@/lib/require-signed-in'
import { UserProfile } from './_components/user-profile'
import prisma from '@/lib/prisma'
import { UserOrderList } from './_components/user-order-list'
import { DeleteUserAccountButton } from './_components/delete-account-button'

export default async function UserPage() {
  const session = await requireSignedIn()

  const orders = await prisma.order.findMany()

  return (
    <div className="mx-auto max-w-prose p-4">
      <h1 className="mb-4 text-2xl font-bold">{session.user.name} Dashboard</h1>
      <UserProfile user={session.user} />
      <UserOrderList orders={orders} />
      <DeleteUserAccountButton variant={'destructive'} />
    </div>
  )
}
