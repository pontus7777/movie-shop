'use server'

import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/lib/auth'
import {
  addToCookieCart,
  addToDatabaseCart,
  removeFromCookieCart,
  removeFromDatabaseCart,
  clearCookieCart,
  clearDatabaseCart,
} from '@/lib/cart'

const movieIdSchema = z.string().min(1)

async function getUserSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function addToCart(movieId: string) {
  const id = movieIdSchema.parse(movieId)
  const session = await getUserSession()

  const result = session
    ? await addToDatabaseCart(session.user.id, id)
    : await addToCookieCart(id)

  return result
}

export async function removeFromCart(movieId: string, decrement = false) {
  const id = movieIdSchema.parse(movieId)
  const session = await getUserSession()

  const result = session
    ? await removeFromDatabaseCart(session.user.id, id, decrement)
    : await removeFromCookieCart(id, decrement)

  return result
}

export async function clearCart() {
  const session = await getUserSession()

  const result = session ? await clearDatabaseCart(session.user.id) : await clearCookieCart()

  return result
}
