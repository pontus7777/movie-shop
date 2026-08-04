'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { deleteUserSchema, type DeleteUserInput } from '@/lib/validations/user'

export async function reactivateUser(data: DeleteUserInput) {
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
      data: { isDeactivated: false, deactivatedAt: null },
    })

    return { success: true }
  } catch (error) {
    console.error('Error reactivating user:', error)
    return { success: false, error: 'Could not reactivate this user.' }
  }
}
