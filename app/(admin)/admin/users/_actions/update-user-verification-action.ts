'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { z } from 'zod'

const UpdateVerificationSchema = z.object({
  id: z.string(),
  emailVerified: z.boolean(),
})

export async function updateUserVerification(values: z.infer<typeof UpdateVerificationSchema>) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return { success: false, error: access.error }
  }

  const data = UpdateVerificationSchema.parse(values)

  await prisma.user.update({
    where: { id: data.id },
    data: { emailVerified: data.emailVerified },
  })

  return { success: true }
}
