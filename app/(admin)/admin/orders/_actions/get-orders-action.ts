'use server'

import { Prisma, OrderStatus, PaymentMethod } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath } from 'next/cache'

const PAGE_SIZE = 10

type GetOrdersParams = {
  page?: number
  search?: string
  status?: string
  payment?: string
}

export async function getOrders({ page = 1, search, status, payment }: GetOrdersParams) {
  await requireAdmin()
  const skip = (page - 1) * PAGE_SIZE

  const where: Prisma.OrderWhereInput = {
    AND: [
      search
        ? {
            OR: [
              {
                id: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                user: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                user: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {},

      status && status !== 'all'
        ? {
            status: status.toUpperCase() as OrderStatus,
          }
        : {},
      payment
        ? {
            paymentMethod: payment.toUpperCase() as PaymentMethod,
          }
        : {},
    ],
  }

  const orders = await prisma.order.findMany({
    skip,
    take: PAGE_SIZE,
    where,
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
  })

  const total = await prisma.order.count()

  return {
    orders,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}

export async function cancelOrder(orderId: string) {
  await requireAdmin()

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true },
  })

  if (!order) {
    return { success: false, error: 'Order not found' }
  }

  if (order.status === 'CANCELLED') {
    return { success: false, error: 'Order is already cancelled' }
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
  })

  revalidatePath('/admin/orders')

  return { success: true }
}
