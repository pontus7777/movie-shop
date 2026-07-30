'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { z } from 'zod'

const UpdateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(32, 'Title must be less than 32 characters'),
})

export async function updateUser(values: z.infer<typeof UpdateUserSchema>) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return { success: false, error: access.error }
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
