'use server'

import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import {
  addToDatabaseWishlist,
  removeFromDatabaseWishlist,
  toggleDatabaseWishlist,
} from '@/lib/wishlist'
import { revalidatePath } from 'next/cache'

type WishlistResult =
  | { success: true; wishlisted: boolean }
  | { success: false; reason: 'unauthenticated' }

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function addToWishlist(movieId: string): Promise<WishlistResult> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  await addToDatabaseWishlist(userId, movieId)
  revalidatePath('/wishlist')
  return { success: true, wishlisted: true }
}

export async function removeFromWishlist(movieId: string): Promise<WishlistResult> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  await removeFromDatabaseWishlist(userId, movieId)
  revalidatePath('/wishlist')
  return { success: true, wishlisted: false }
}

export async function toggleWishlist(movieId: string): Promise<WishlistResult> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  const result = await toggleDatabaseWishlist(userId, movieId)
  // Also revalidate /movies since ShopMovieCard's heart button lives there
  revalidatePath('/wishlist')
  revalidatePath('/movies')
  return { success: true, wishlisted: result.wishlisted }
}
