'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { checkAdminAccess } from '@/lib/session-validation'
import { z } from 'zod'

const AddUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
})

export async function createUser(values: z.infer<typeof AddUserSchema>) {
  try {
    const access = await checkAdminAccess()
    if (!access.authorized) {
      return { success: false, error: access.error }
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
