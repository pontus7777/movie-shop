'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/session-validation'
import { discountTierSchema, type DiscountTierInput } from '@/lib/validations/discount'

export async function createDiscountTier(input: DiscountTierInput) {
  await requireAdmin()

  const parsed = discountTierSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.bulkDiscountTier.create({ data: parsed.data })
  revalidatePath('/admin/discounts')
  revalidatePath('/cart')
}

export async function updateDiscountTier(id: string, input: DiscountTierInput) {
  await requireAdmin()

  const parsed = discountTierSchema.safeParse(input)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  await prisma.bulkDiscountTier.update({ where: { id }, data: parsed.data })
  revalidatePath('/admin/discounts')
  revalidatePath('/cart')
}

export async function deleteDiscountTier(id: string) {
  await requireAdmin()
  await prisma.bulkDiscountTier.delete({ where: { id } })
  revalidatePath('/admin/discounts')
  revalidatePath('/cart')
}
