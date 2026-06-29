import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

export * from './cookie-cart'
export * from './db-cart'
export * from './merge-cart'

import { getCookieCart } from './cookie-cart'
import { getDatabaseCart } from './db-cart'

export async function getCart(): Promise<Record<string, number>> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return getCookieCart()
  }

  const cart = await getDatabaseCart(session.user.id)

  if (!cart) {
    return {}
  }

  return Object.fromEntries(cart.items.map((item) => [item.movieId, item.quantity]))
}
