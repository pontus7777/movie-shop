import type Stripe from 'stripe'

import prisma from '@/lib/prisma'
import { resolvePaymentMethod } from '@/lib/stripe-payment-method'

// Called from both the Stripe webhook and the checkout success page, which race
// each other. The guarded update below makes running it twice harmless.
export async function fulfillOrder(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId

  if (!orderId || session.payment_status !== 'paid') {
    return
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { userId: true, total: true, items: { select: { movieId: true } } },
  })

  if (!order) {
    return
  }

  if (session.amount_total !== order.total) {
    console.error(
      `Order ${orderId}: charged ${session.amount_total} but order total is ${order.total}.`,
    )
  }

  const paymentMethod = await resolvePaymentMethod(session.id)

  await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: 'PENDING' },
      data: { status: 'PAID', paymentMethod },
    })

    if (count === 0) {
      return
    }

    await tx.cartItem.deleteMany({
      where: { cart: { userId: order.userId } },
    })

    await tx.wishlistItem.deleteMany({
      where: {
        wishlist: { userId: order.userId },
        movieId: { in: order.items.map((item) => item.movieId) },
      },
    })
  })
}
