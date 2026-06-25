// const cart =
//     {
//         id:quantity,
//         "my-id":5,
//     }

import { cookies } from "next/headers"
import { z } from "zod"

const cookieName = "cart"
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24 * 30,
}

export const cartSchema = z.record(z.string(), z.int())

export type Cart = z.infer<typeof cartSchema>

export async function getCart(): Promise<Cart> {
  try {
    const cookieValue = (await cookies()).get(cookieName)?.value

    if (!cookieValue) {
      return {}
    }

    // const result = cartSchema.safeParse({});
    // if (result.success) {
    //   result.
    // }

    return cartSchema.parse(JSON.parse(cookieValue))
  } catch {
    return {}
  }
}

export async function addToCart(id: string): Promise<Cart> {
  const cart = await getCart()
  const existingItem = cart[id]
  if (existingItem) {
    cart[id]++
  } else {
    cart[id] = 1
  }

  const cookieStore = await cookies()
  cookieStore.set(cookieName, JSON.stringify(cart), cookieOptions)

  return cart
}

export async function removeFromCart(
  id: string,
  decrement = false
): Promise<Cart> {
  const cart = await getCart()
  const existingItem = cart[id]
  if (existingItem !== undefined) {
    if (decrement) {
      cart[id]--
      if (cart[id] <= 0) {
        delete cart[id]
      }
    } else {
      delete cart[id]
    }
  }

  const cookieStore = await cookies()
  cookieStore.set(cookieName, JSON.stringify(cart), cookieOptions)

  return cart
}

export async function clearCart(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(cookieName)
}
