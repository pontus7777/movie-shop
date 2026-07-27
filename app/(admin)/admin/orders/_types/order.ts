import { Prisma } from '@/generated/prisma/client'

export type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true
    shippingAddress: true
    items: {
      include: {
        movie: true
      }
    }
  }
}>

export type OrdersWithRelations = Prisma.OrderGetPayload<{
  include: {
    user: true
    items: {
      include: {
        movie: true
      }
    }
    shippingAddress: true
  }
}>
