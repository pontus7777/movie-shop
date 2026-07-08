'use server'

import prisma from '@/lib/prisma'

const PAGE_SIZE = 10

export async function getOrders(page = 1) {
  const skip = (page - 1) * PAGE_SIZE

  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      skip,
      take: PAGE_SIZE,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        items: {
          include: {
            movie: true,
          },
        },
        shippingAddress: true,
      },
    }),

    prisma.order.count(),
  ])

  return {
    orders,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}
