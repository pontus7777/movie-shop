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

export async function addToCart(movieId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return addToDatabaseCart(session.user.id, movieId)
  }

  return addToCookieCart(movieId)
}

export async function removeFromCart(movieId: string, decrement = false) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return removeFromDatabaseCart(session.user.id, movieId, decrement)
  }

  return removeFromCookieCart(movieId, decrement)
}

export async function clearCart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    return clearDatabaseCart(session.user.id)
  }

  return clearCookieCart()
}
