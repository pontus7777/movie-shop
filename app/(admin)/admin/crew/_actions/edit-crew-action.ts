'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

const editCrewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  movieIds: z.array(z.string()).optional(),
})

export async function editCrew(values: z.infer<typeof editCrewSchema>) {
  await requireAdmin()
  const data = editCrewSchema.parse(values)

  const updatedCrew = await prisma.crew.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
    },
  })

  revalidatePath('/admin/crew')

  return updatedCrew
}
