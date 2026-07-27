import 'server-only'
import { redirect } from 'next/navigation'
import { auth } from './auth'
import { headers } from 'next/headers'

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  return session
}

export type AuthSession = Awaited<ReturnType<typeof requireAuth>>

export async function requireAdmin() {
  const session = await requireAuth()

  if (session.user.role !== 'admin') {
    redirect('/')
  }

  return session
}
