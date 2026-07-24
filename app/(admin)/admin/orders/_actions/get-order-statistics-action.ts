'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

export async function getOrderStatistics() {
  await requireAdmin()

  const totalOrders = await prisma.order.count()
  const pendingOrders = await prisma.order.count({
    where: {
      status: 'PENDING',
    },
  })
  const paidOrders = await prisma.order.count({
    where: {
      status: 'PAID',
    },
  })
  const revenue = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
  })

  return {
    totalOrders,
    pendingOrders,
    paidOrders,
    revenue: revenue._sum.total ?? 0,
  }
}
