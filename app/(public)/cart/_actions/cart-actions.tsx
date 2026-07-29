'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import {
  addToCookieCart,
  addToDatabaseCart,
  removeFromCookieCart,
  removeFromDatabaseCart,
  clearCookieCart,
  clearDatabaseCart,
} from '@/lib/cart'

async function getUserSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

function revalidateCart() {
  revalidatePath('/cart')
  // revalidatePath('/movies')
}

export async function addToCart(movieId: string) {
  const session = await getUserSession()

  const result = session
    ? await addToDatabaseCart(session.user.id, movieId)
    : await addToCookieCart(movieId)

  revalidateCart()

  return result
}

export async function removeFromCart(movieId: string, decrement = false) {
  const session = await getUserSession()

  const result = session
    ? await removeFromDatabaseCart(session.user.id, movieId, decrement)
    : await removeFromCookieCart(movieId, decrement)

  revalidateCart()

  return result
}

export async function clearCart() {
  const session = await getUserSession()

  const result = session
    ? await clearDatabaseCart(session.user.id)
    : await clearCookieCart()

  revalidateCart()

  return result
}