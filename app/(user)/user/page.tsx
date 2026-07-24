import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import TabContent from './_components/user-tab-content'

export default async function UserPage() {
  const session = await requireAuth()

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: { include: { movie: true } },
      shippingAddress: true,
    },
  })

  return <TabContent session={session} orders={orders} />
}
