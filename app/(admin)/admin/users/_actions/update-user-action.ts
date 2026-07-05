'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  //   email: z.string().email(),
  //   role: z.enum(['user', 'admin']),
})

export async function updateUser(data: unknown) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/sign-in')
  if (session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const parsed = UpdateUserSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'Invalid data' }
  }

  const { id, name } = parsed.data
  await prisma.user.update({
    where: { id },
    data: { name },
  })

  return { success: true }
}
