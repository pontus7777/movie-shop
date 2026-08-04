import { OrderStatus } from '@/generated/prisma/client'

export const orderStatusStyles: Record<OrderStatus, string> = {
  PAID: 'bg-green-500/10 text-green-400',
  PENDING: 'bg-yellow-500/10 text-yellow-400',
  CANCELLED: 'bg-red-500/10 text-red-400',
}

export function formatOrderStatus(status: OrderStatus) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}
