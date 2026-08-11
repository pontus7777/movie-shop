import 'server-only'

import { z } from 'zod'

import { Prisma, OrderStatus, PaymentMethod } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

const PAGE_SIZE = 10

// Filters arrive from the URL as lowercase ('paid') or 'all' for no filter, so
// uppercase before matching. Anything still unrecognised — 'all', or a hand-typed
// value — falls through to undefined, which reads as "don't filter on this".
function optionalEnum<T extends Record<string, string>>(values: T) {
  return z
    .preprocess(
      (value) => (typeof value === 'string' ? value.toUpperCase() : value),
      z.enum(values),
    )
    .optional()
    .catch(undefined)
}

const getOrdersParamsSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  search: z.string().trim().min(1).max(100).optional().catch(undefined),
  status: optionalEnum(OrderStatus),
  payment: optionalEnum(PaymentMethod),
})

export type GetOrdersParams = z.input<typeof getOrdersParamsSchema>

export async function getOrders(params: GetOrdersParams) {
  await requireAdmin()

  const { page, search, status, payment } = getOrdersParamsSchema.parse(params)
  const skip = (page - 1) * PAGE_SIZE

  const where: Prisma.OrderWhereInput = {
    ...(search && {
      OR: [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ],
    }),
    ...(status && { status }),
    ...(payment && { paymentMethod: payment }),
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
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
    }),

    prisma.order.count({ where }),
  ])

  return {
    orders,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / PAGE_SIZE),
  }
}
