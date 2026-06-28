import { cookies } from 'next/headers'
import { z } from 'zod'

const COOKIE_NAME = 'cart'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 30,
}

export const cartSchema = z.record(z.string(), z.number().int())

export type CookieCart = z.infer<typeof cartSchema>

export async function getCookieCart(): Promise<CookieCart> {
  try {
    const cookieValue = (await cookies()).get(COOKIE_NAME)?.value

    if (!cookieValue) {
      return {}
    }

    return cartSchema.parse(JSON.parse(cookieValue))
  } catch {
    return {}
  }
}

export async function addToCookieCart(movieId: string) {
  const cart = await getCookieCart()

  cart[movieId] = (cart[movieId] ?? 0) + 1
  ;(await cookies()).set(COOKIE_NAME, JSON.stringify(cart), COOKIE_OPTIONS)

  return cart
}

export async function removeFromCookieCart(movieId: string, decrement = false) {
  const cart = await getCookieCart()

  if (!(movieId in cart)) {
    return cart
  }

  if (decrement) {
    cart[movieId]--

    if (cart[movieId] <= 0) {
      delete cart[movieId]
    }
  } else {
    delete cart[movieId]
  }

  ;(await cookies()).set(COOKIE_NAME, JSON.stringify(cart), COOKIE_OPTIONS)

  return cart
}

export async function clearCookieCart() {
  ;(await cookies()).delete(COOKIE_NAME)
}
