'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(32, 'Title must be less than 32 characters'),
  //   role: z.enum(['user', 'admin']),
})

export async function updateUser(values: z.infer<typeof UpdateUserSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const data = UpdateUserSchema.parse(values)

  if (!data) {
    return { success: false, error: 'Invalid data' }
  }

  await prisma.user.update({
    where: { id: data.id },
    data: { name: data.name },
  })

  return { success: true }
}
