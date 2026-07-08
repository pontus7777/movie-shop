import { Prisma } from '@/generated/prisma/client'

type OrderWithDetails = Prisma.OrderGetPayload<{
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
