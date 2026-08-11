import 'server-only'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

export async function getOrderStatistics() {
  await requireAdmin()
  const [totalOrders, pendingOrders, paidOrders, revenue] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({
      where: {
        status: 'PENDING',
      },
    }),
    prisma.order.count({
      where: {
        status: 'PAID',
      },
    }),
    prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: { status: 'PAID' },
    }),
  ])

  return {
    totalOrders,
    pendingOrders,
    paidOrders,
    revenue: revenue._sum.total ?? 0,
  }
}
