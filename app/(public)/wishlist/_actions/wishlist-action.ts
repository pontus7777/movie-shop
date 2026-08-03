'use server'

import { headers } from 'next/headers'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import {
  addToDatabaseWishlist,
  removeFromDatabaseWishlist,
  toggleDatabaseWishlist,
} from '@/lib/wishlist'
import { revalidatePath } from 'next/cache'

const movieIdSchema = z.string().min(1)

type WishlistResult =
  | { success: true; wishlisted: boolean }
  | { success: false; reason: 'unauthenticated' | 'invalid' }

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user?.id ?? null
}

export async function addToWishlist(movieId: string): Promise<WishlistResult> {
  const parsed = movieIdSchema.safeParse(movieId)
  if (!parsed.success) {
    return { success: false, reason: 'invalid' }
  }
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  await addToDatabaseWishlist(userId, parsed.data)
  revalidatePath('/wishlist')
  return { success: true, wishlisted: true }
}

export async function removeFromWishlist(movieId: string): Promise<WishlistResult> {
  const parsed = movieIdSchema.safeParse(movieId)
  if (!parsed.success) {
    return { success: false, reason: 'invalid' }
  }
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  await removeFromDatabaseWishlist(userId, parsed.data)
  revalidatePath('/wishlist')
  return { success: true, wishlisted: false }
}

export async function toggleWishlist(movieId: string): Promise<WishlistResult> {
  const parsed = movieIdSchema.safeParse(movieId)
  if (!parsed.success) {
    return { success: false, reason: 'invalid' }
  }
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  const result = await toggleDatabaseWishlist(userId, parsed.data)
  // Also revalidate /movies since ShopMovieCard's heart button lives there
  revalidatePath('/wishlist')
  revalidatePath('/movies')
  return { success: true, wishlisted: result.wishlisted }
}

/***************** SHARING ************************ */

import { enablePublicSharing, disablePublicSharing } from '@/lib/wishlist'

export async function shareWishlist(): Promise<
  { success: true; shareId: string } | { success: false; reason: 'unauthenticated' }
> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  const wishlist = await enablePublicSharing(userId)
  revalidatePath('/wishlist')
  return { success: true, shareId: wishlist.shareId! }
}

export async function unshareWishlist(): Promise<
  { success: true } | { success: false; reason: 'unauthenticated' }
> {
  const userId = await getUserId()
  if (!userId) {
    return { success: false, reason: 'unauthenticated' }
  }
  await disablePublicSharing(userId)
  revalidatePath('/wishlist')
  return { success: true }
}
