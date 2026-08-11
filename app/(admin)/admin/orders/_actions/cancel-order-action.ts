'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

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
