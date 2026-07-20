'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { notFound } from 'next/navigation'

export async function getOrderById(id: string) {
  await requireAdmin()
  const order = await prisma.order.findUnique({
    where: {
      id,
    },

    include: {
      user: true,

      shippingAddress: true,

      items: {
        include: {
          movie: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return order
}
