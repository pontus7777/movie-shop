'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

const createCrewSchema = z.object({
  name: z.string().min(1),
  movieIds: z.array(z.string()).optional(),
})

export async function createCrew(values: z.infer<typeof createCrewSchema>) {
  await requireAdmin()
  const data = createCrewSchema.parse(values)

  const newCrew = await prisma.crew.create({
    data: {
      name: data.name,
    },
  })

  revalidatePath('/admin/crew')

  return newCrew
}
