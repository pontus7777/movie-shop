'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { checkAdminAccess } from '@/lib/session-validation'
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user'

export async function createUser(values: CreateUserInput) {
  try {
    const access = await checkAdminAccess()
    if (!access.authorized) {
      return { success: false, error: access.error }
    }

    const data = createUserSchema.parse(values)

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
