'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkout'
import { calculateCartTotalsInCents } from '@/lib/discount'
import { getEffectivePriceInCents } from '@/lib/pricing'
import { stripe } from '@/lib/stripe'
import { buildLineItems } from '@/lib/stripe-line-items'
import { createBulkDiscountCoupon } from '@/lib/stripe-discount'

export async function checkout(input: CheckoutInput) {
  const parsed = checkoutSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid checkout data.')
  }

  const data = parsed.data

  const authSession = await auth.api.getSession({
    headers: await headers(),
  })

  if (!authSession) {
    throw new Error('You must be signed in.')
  }

  const cart = await prisma.cart.findUnique({
    where: {
      userId: authSession.user.id,
    },
    include: {
      items: {
        include: {
          movie: true,
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    throw new Error('Your cart is empty.')
  }

  // One clock read for the whole checkout. Sale windows can expire mid-request,
  // so the order total, the OrderItem rows and what Stripe charges all price
  // against the same instant — otherwise they can disagree.
  const now = new Date()

  // Effective (sale) price at purchase time, not the movie's list price, so
  // order history reflects what was charged.
  const pricedItems = cart.items.map((item) => ({
    movieId: item.movieId,
    title: item.movie.title,
    quantity: item.quantity,
    priceInCents: getEffectivePriceInCents(item.movie, now),
  }))

  // Kept in integer cents to avoid floating point drift in stored prices.
  const { totalInCents, discountAmountInCents, discountPercentage } =
    await calculateCartTotalsInCents(cart.items, now)

  // Everything below succeeds or everything rolls back
  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId: authSession.user.id,
        total: totalInCents,
        status: 'PENDING',
      },
    })

    await tx.shippingAddress.create({
      data: {
        orderId: createdOrder.id,

        firstName: data.firstName,
        lastName: data.lastName,

        street: data.street,
        postalCode: data.postalCode,
        city: data.city,
        country: data.country,
      },
    })

    await tx.orderItem.createMany({
      data: pricedItems.map((item) => ({
        orderId: createdOrder.id,
        movieId: item.movieId,
        quantity: item.quantity,
        priceInCents: item.priceInCents,
      })),
    })

    return createdOrder
  })

  const discounts =
    discountAmountInCents > 0
      ? [{ coupon: await createBulkDiscountCoupon(discountAmountInCents, discountPercentage) }]
      : undefined

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: buildLineItems(pricedItems),
    discounts,
    customer_email: authSession.user.email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: { orderId: order.id },
  })

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  })

  // Only populated for hosted checkout; null in embedded mode.
  if (!session.url) {
    throw new Error('Stripe did not return a checkout URL.')
  }

  redirect(session.url)
}
