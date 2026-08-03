'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { updateUserSchema, type UpdateUserInput } from '@/lib/validations/user'

export async function updateUser(values: UpdateUserInput) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return { success: false, error: access.error }
  }

  const data = updateUserSchema.parse(values)

  if (!data) {
    return { success: false, error: 'Invalid data' }
  }

  await prisma.user.update({
    where: { id: data.id },
    data: { name: data.name },
  })

  return { success: true }
}
