'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/session-validation'

export async function createDiscountTier(data: { minQuantity: number; percentageOff: number }) {
  await requireAdmin()
  await prisma.bulkDiscountTier.create({ data })
  revalidatePath('/admin/discounts')
  revalidatePath('/cart')
}

export async function updateDiscountTier(
  id: string,
  data: { minQuantity: number; percentageOff: number; active: boolean },
) {
  await requireAdmin()
  await prisma.bulkDiscountTier.update({ where: { id }, data })
  revalidatePath('/admin/discounts')
  revalidatePath('/cart')
}

export async function deleteDiscountTier(id: string) {
  await requireAdmin()
  await prisma.bulkDiscountTier.delete({ where: { id } })
  revalidatePath('/admin/discounts')
  revalidatePath('/cart')
}
