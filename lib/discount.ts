import prisma from './prisma'
import { convertToEuro } from './priceUtils'
import { getEffectivePriceInCents } from './pricing'

export type CartTotals = {
  totalQuantity: number
  subtotal: number
  discountPercentage: number
  discountAmount: number
  total: number
}

export async function getBestDiscountTier(totalQuantity: number) {
  const tiers = await prisma.bulkDiscountTier.findMany({
    where: {
      active: true,
      minQuantity: { lte: totalQuantity },
    },
    orderBy: { minQuantity: 'desc' },
    take: 1,
  })

  return tiers[0] ?? null
}

export type CartItemForPricing = {
  movie: {
    priceInCents: number
    salePriceInCents: number | null
    saleStartsAt: Date | null
    saleEndsAt: Date | null
  }
  quantity: number
}

export type CartTotalsInCents = {
  totalQuantity: number
  subtotalInCents: number
  discountPercentage: number
  discountAmountInCents: number
  totalInCents: number
}

// Cents-based totals, kept in integer cents throughout. Anything that persists
// a price (orders, order items) must go through this — not the EUR-based
// calculateCartTotals below, which uses floating point and is display-only.
export async function calculateCartTotalsInCents(
  items: CartItemForPricing[],
): Promise<CartTotalsInCents> {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const subtotalInCents = items.reduce(
    (sum, item) => sum + getEffectivePriceInCents(item.movie) * item.quantity,
    0,
  )

  const bestTier = await getBestDiscountTier(totalQuantity)
  const discountPercentage = bestTier?.percentageOff ?? 0
  const discountAmountInCents = Math.round(subtotalInCents * (discountPercentage / 100))
  const totalInCents = subtotalInCents - discountAmountInCents

  return {
    totalQuantity,
    subtotalInCents,
    discountPercentage,
    discountAmountInCents,
    totalInCents,
  }
}

export async function calculateCartTotals(items: CartItemForPricing[]): Promise<CartTotals> {
  const {
    totalQuantity,
    subtotalInCents,
    discountPercentage,
    discountAmountInCents,
    totalInCents,
  } = await calculateCartTotalsInCents(items)

  return {
    totalQuantity,
    subtotal: convertToEuro(subtotalInCents),
    discountPercentage,
    discountAmount: convertToEuro(discountAmountInCents),
    total: convertToEuro(totalInCents),
  }
}
