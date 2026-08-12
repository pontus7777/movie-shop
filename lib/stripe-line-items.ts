import type Stripe from 'stripe'

import { CURRENCY } from '@/lib/stripe'

type LineItemInput = {
  title: string
  quantity: number
  priceInCents: number
}

export function buildLineItems(
  items: LineItemInput[],
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: CURRENCY,
      unit_amount: item.priceInCents,
      product_data: { name: item.title },
    },
  }))
}
