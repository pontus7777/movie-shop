'use server'

import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const DeleteSchema = z.object({
  id: z.string(),
})

export async function deleteUser(data: z.infer<typeof DeleteSchema>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' }
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

  // return { success: true }
}
