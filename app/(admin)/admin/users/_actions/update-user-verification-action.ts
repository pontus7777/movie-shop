'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const UpdateVerificationSchema = z.object({
  id: z.string(),
  emailVerified: z.boolean(),
})

export async function updateUserVerification(values: z.infer<typeof UpdateVerificationSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
  }

  const data = UpdateVerificationSchema.parse(values)

  await prisma.user.update({
    where: { id: data.id },
    data: { emailVerified: data.emailVerified },
  })

  return { success: true }
}
