'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

const editCrewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  role: z.enum(['ACTOR', 'DIRECTOR']),
  movieIds: z.array(z.string()).optional(),
})

export async function editCrew(values: z.infer<typeof editCrewSchema>) {
  const data = editCrewSchema.parse(values)

  const updatedCrew = await prisma.crew.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      role: data.role,
      /**
       *  movies: data.movieIds
        ? {
            set: [], // clear existing
            connect: data.movieIds.map((id) => ({ id })),
          }
        : undefined,
       */
    },
    
  })

  revalidatePath('/admin/crew')

  return updatedCrew
}
