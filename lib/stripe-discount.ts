import { CURRENCY, stripe } from '@/lib/stripe'

// amount_off, not percent_off: the exact cent figure from calculateCartTotalsInCents
// is handed to Stripe, so the charge cannot drift from the stored order total.
export async function createBulkDiscountCoupon(
  discountAmountInCents: number,
  discountPercentage: number,
): Promise<string> {
  const coupon = await stripe.coupons.create({
    amount_off: discountAmountInCents,
    currency: CURRENCY,
    name: `Bulk discount (${discountPercentage}% off)`,
  })

  return coupon.id
}
