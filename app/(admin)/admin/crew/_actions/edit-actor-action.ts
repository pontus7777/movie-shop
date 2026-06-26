'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

const editActorSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  movieIds: z.array(z.string()).optional(),
})

export async function editActor(values: z.infer<typeof editActorSchema>) {
  const data = editActorSchema.parse(values)

  const updatedActor = await prisma.crew.update({
    where: {
      id: data.id,
      role: {'equals': 'ACTOR'}
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

  return updatedActor
}
