'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { checkoutSchema, type CheckoutInput } from '@/lib/validations/checkout'
import { removeMoviesFromWishlist } from '@/lib/wishlist'
import { calculateCartTotalsInCents } from '@/lib/discount'
import { getEffectivePriceInCents } from '@/lib/pricing'

export async function checkout(input: CheckoutInput) {
  // Validate input on the server as well
  const parsed = checkoutSchema.safeParse(input)

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? 'Invalid checkout data.')
  }

  const data = parsed.data

  // Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error('You must be signed in.')
  }

  // Load user's cart
  const cart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
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

  // Calculate order total — same sale price + bulk discount logic the
  // checkout page shows the customer, kept in integer cents to avoid
  // floating point drift in stored prices.
  const { totalInCents } = await calculateCartTotalsInCents(cart.items)

  // Fake payment delay
  // await new Promise((resolve) => setTimeout(resolve, 1500))

  if (process.env.SIMULATE_PAYMENT_DELAY === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 1500))
  }

  // Everything below succeeds or everything rolls back
  const order = await prisma.$transaction(async (tx) => {
    // Create order
    const createdOrder = await tx.order.create({
      data: {
        userId: session.user.id,
        total: totalInCents,
        status: 'PAID',
        paymentMethod: data.paymentMethod,
      },
    })

    // Create shipping address
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

    // Create order items — store the effective (sale) price at purchase time,
    // not the movie's list price, so order history reflects what was charged.
    await tx.orderItem.createMany({
      data: cart.items.map((item) => ({
        orderId: createdOrder.id,
        movieId: item.movieId,
        quantity: item.quantity,
        priceInCents: getEffectivePriceInCents(item.movie),
      })),
    })

    // Empty cart
    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    })

    return createdOrder
  })

  const purchasedMovieIds = cart.items.map((item) => item.movieId)
  await removeMoviesFromWishlist(session.user.id, purchasedMovieIds)

  redirect(`/checkout/success?orderId=${order.id}`)
}
