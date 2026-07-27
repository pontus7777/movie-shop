'use server'

import { auth } from '@/lib/auth'
import { requireAuth } from '@/lib/session-validation'
import { headers } from 'next/headers'

export async function deleteUser(userId: string) {
  await requireAuth()

  await auth.api.removeUser({
    body: {
      userId: userId, // required
    },
    // This endpoint requires session cookies.
    headers: await headers(),
  })
}
