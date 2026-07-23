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

export async function calculateCartTotals(
  items: {
    movie: {
      priceInCents: number
      salePriceInCents: number | null
      saleStartsAt: Date | null
      saleEndsAt: Date | null
    }
    quantity: number
  }[],
): Promise<CartTotals> {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  // const subtotal = items.reduce(
  //   (sum, item) => sum + convertToEuro(item.movie.priceInCents) * item.quantity,
  //   0,
  // )

  const subtotal = items.reduce(
    (sum, item) => sum + convertToEuro(getEffectivePriceInCents(item.movie)) * item.quantity,
    0,
  )

  const bestTier = await getBestDiscountTier(totalQuantity)
  const discountPercentage = bestTier?.percentageOff ?? 0
  const discountAmount = subtotal * (discountPercentage / 100)
  const total = subtotal - discountAmount

  return {
    totalQuantity,
    subtotal,
    discountPercentage,
    discountAmount,
    total,
  }
}
