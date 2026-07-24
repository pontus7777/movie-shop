'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

export async function deleteCrew(crewId: string) {
  await requireAdmin()
  await prisma.crew.delete({
    where: {
      id: crewId,
    },
  })

  revalidatePath('/admin/crew')
}
