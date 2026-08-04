'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { deleteUserSchema, type DeleteUserInput } from '@/lib/validations/user'

export async function deleteUser(data: DeleteUserInput) {
  const access = await checkAdminAccess()

  if (!access.authorized) {
    return { success: false, error: access.error }
  }

  const parsed = deleteUserSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'Invalid data' }
  }
  // Prevent an admin from deactivating their own account
  if (parsed.data.id === access.session.user.id) {
    return { success: false, error: 'You cannot deactivate your own account.' }
  }

  try {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: parsed.data.id },
        data: { isDeactivated: true, deactivatedAt: new Date() },
      }),

      prisma.session.deleteMany({
        where: { userId: parsed.data.id },
      }),
    ])

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
