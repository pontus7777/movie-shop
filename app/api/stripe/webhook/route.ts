import type Stripe from 'stripe'
import type { NextRequest } from 'next/server'

import { fulfillOrder } from '@/lib/fulfill-order'
import { stripe } from '@/lib/stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is not set.')
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header.', { status: 400 })
  }

  let event: Stripe.Event

  try {
    // request.text() and not request.json(): the signature covers the exact
    // bytes Stripe sent, and re-serialising parsed JSON will not reproduce them.
    event = await stripe.webhooks.constructEventAsync(
      await request.text(),
      signature,
      webhookSecret,
    )
  } catch {
    return new Response('Invalid signature.', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    await fulfillOrder(event.data.object)
  }

  // Anything unhandled still gets a 200, otherwise Stripe retries it for days.
  return new Response(null, { status: 200 })
}
