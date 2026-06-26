'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

const createCrewSchema = z.object({
  name: z.string().min(1),
  role: z.enum(['ACTOR', 'DIRECTOR']),
  movieIds: z.array(z.string()).optional(),
})

export async function createCrew(values: z.infer<typeof createCrewSchema>) {
  const data = createCrewSchema.parse(values)

  const newCrew = await prisma.crew.create({
    data: {
      name: data.name,
      role: data.role,
    },
  })

  revalidatePath('/admin/crew')
  /**
   * The cached data for /admin/crew is now stale.
   * Refresh it the next time someone visits that page.
   */

  return newCrew
}
