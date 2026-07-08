'use server'

import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'

export async function getOrderById(id: string) {
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
