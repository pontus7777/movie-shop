'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

const deleteCrewSchema = z.string().min(1)

export async function deleteCrew(crewId: string) {
  await requireAdmin()
  const id = deleteCrewSchema.parse(crewId)
  await prisma.crew.delete({
    where: {
      id,
    },
  })

  revalidatePath('/admin/crew')
  updateTag('movies')
}
