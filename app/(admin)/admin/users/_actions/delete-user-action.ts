'use server'

import prisma from '@/lib/prisma'
import { checkAdminAccess } from '@/lib/session-validation'
import { z } from 'zod'

const DeleteSchema = z.object({
  id: z.string(),
})

export async function deleteUser(data: z.infer<typeof DeleteSchema>) {
  const access = await checkAdminAccess()
  if (!access.authorized) {
    return { success: false, error: access.error }
  }

  const parsed = DeleteSchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, error: 'Invalid data' }
  }

  try {
    await prisma.user.delete({
      where: {
        id: parsed.data.id,
      },
    })

    return {
      success: true,
    }
  } catch {
    return {
      success: false,
      error: 'User not found or could not be deleted.',
    }
  }
}
