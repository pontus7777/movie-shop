import type { PaymentMethod } from '@/generated/prisma/client'
import { stripe } from '@/lib/stripe'

// Stripe's method list is open-ended and grows over time. Anything we don't
// model stays null rather than being forced into the nearest enum member.
const STRIPE_TYPE_TO_ENUM: Record<string, PaymentMethod> = {
  card: 'CARD',
  paypal: 'PAYPAL',
  swish: 'SWISH',
}

export async function resolvePaymentMethod(sessionId: string): Promise<PaymentMethod | null> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent.payment_method'],
    })

    const intent = session.payment_intent

    if (!intent || typeof intent === 'string') {
      return null
    }

    const method = intent.payment_method

    if (!method || typeof method === 'string') {
      return null
    }

    return STRIPE_TYPE_TO_ENUM[method.type] ?? null
  } catch (error) {
    // The customer has already paid. Failing to label how is not worth
    // rejecting the webhook over.
    console.error(`Could not resolve payment method for session ${sessionId}:`, error)
    return null
  }
}
