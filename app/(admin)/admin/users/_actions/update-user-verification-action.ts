'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import {
  updateUserVerificationSchema,
  type UpdateUserVerificationInput,
} from '@/lib/validations/user'

export async function updateUserVerification(values: UpdateUserVerificationInput) {
  const access = await checkAdminAccess()

  if (!access.authorized) {
    return { success: false, error: access.error }
  }

  const parsed = updateUserVerificationSchema.safeParse(values)

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data.' }
  }

  await prisma.user.update({
    where: { id: parsed.data.id },
    data: { emailVerified: parsed.data.emailVerified },
  })

  return { success: true }
}
