'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const AddUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin']),
})
type ActionResult = { success: true; user: any } | { success: false; error: string }

export async function createUser(values: unknown): Promise<ActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  if (session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const data = AddUserSchema.parse(values)

  const result = await auth.api.createUser({
    headers: await headers(),
    body: {
      email: data.email,
      password: data.password,
      name: data.name,
      role: data.role,
    },
  })

  return { success: true, user: result }
}
