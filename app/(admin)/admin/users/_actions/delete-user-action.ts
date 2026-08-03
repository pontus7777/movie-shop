'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { deleteUserSchema, type DeleteUserInput } from '@/lib/validations/user'
// import { z } from 'zod'

// const DeleteSchema = z.object({
//   id: z.string(),
// })

export async function deleteUser(data: DeleteUserInput) {
  const access = await checkAdminAccess()

  if (!access.authorized) {
    return { success: false, error: access.error }
  }

  const parsed = deleteUserSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'Invalid data' }
  }

  try {
    await prisma.user.update({
      where: { id: parsed.data.id },
      data: { deactivatedAt: new Date() },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: 'User not found or could not be deleted.',
    }
  }
}
