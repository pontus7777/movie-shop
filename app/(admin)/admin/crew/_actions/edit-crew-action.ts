'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

const editCrewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.string().min(1).max(50),
  movieIds: z.array(z.string()).optional(),
})

export async function editCrew(values: z.infer<typeof editCrewSchema>) {
  const data = editCrewSchema.parse(values)

  const updatedCrew = await prisma.crew.update({
    where: {
      id: data.id,
      role: { equals: 'ACTOR' },
    },
    data: {
      name: data.name,
    },

    // IF YOU WANT MOVIES
    // include: {
    //   movies: true,
    // },
  })

  revalidatePath('/admin/crew')

  return updatedCrew
}
