'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'

import {
  addToCookieCart,
  addToDatabaseCart,
  removeFromCookieCart,
  removeFromDatabaseCart,
  clearCookieCart,
  clearDatabaseCart,
} from '@/lib/cart'
import { revalidatePath } from 'next/cache'

export async function addToCart(movieId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if (session) {
  //   return addToDatabaseCart(session.user.id, movieId)
  // }

  // return addToCookieCart(movieId)

  const result = session
    ? await addToDatabaseCart(session.user.id, movieId)
    : await addToCookieCart(movieId)

  revalidatePath('/cart')
  revalidatePath('/movies')
  // If you have a cart icon/badge in a shared layout (e.g. header), also revalidate that:
  revalidatePath('/', 'layout')

  return result
}

export async function removeFromCart(movieId: string, decrement = false) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if (session) {
  //   return removeFromDatabaseCart(session.user.id, movieId, decrement)
  // }

  // return removeFromCookieCart(movieId, decrement)

  const result = session
    ? await removeFromDatabaseCart(session.user.id, movieId, decrement)
    : await removeFromCookieCart(movieId, decrement)

  revalidatePath('/cart')
  revalidatePath('/movies')
  revalidatePath('/', 'layout')

  return result
}

export async function clearCart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // if (session) {
  //   return clearDatabaseCart(session.user.id)
  // }

  // return clearCookieCart()

  const result = session ? await clearDatabaseCart(session.user.id) : await clearCookieCart()

  revalidatePath('/cart')
  revalidatePath('/movies')
  revalidatePath('/', 'layout')

  return result
}
