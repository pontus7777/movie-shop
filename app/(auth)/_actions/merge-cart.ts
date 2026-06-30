'use server'

import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import { mergeCookieCart } from '@/lib/cart'

export async function mergeCurrentUserCart() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return
  }

  await mergeCookieCart(session.user.id)
}
