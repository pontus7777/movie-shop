'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const AddUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
})

export async function createUser(values: z.infer<typeof AddUserSchema>) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) redirect('/sign-in')

    if (session.user.role !== 'admin') {
      return { success: false, error: 'Unauthorized' }
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
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Something went wrong',
    }
  }
}
