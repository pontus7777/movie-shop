'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

const createActorSchema = z.object({
  name: z.string().min(1),
  movieIds: z.array(z.string()).optional(),
})

export async function createActor(values: z.infer<typeof createActorSchema>) {
  const data = createActorSchema.parse(values)

  const newActor = await prisma.actor.create({
    data: {
      name: data.name,
      movies: {
        connect: data.movieIds?.map((id) => ({ id })) ?? [],
        /** Create a new actor.
         *  Find the movies whose IDs are in data.movieIds.
         *  Create relationships between the new actor and those existing movies. */
      },
    },
  })

  revalidatePath('/admin/crew')
  /**
   * The cached data for /admin/crew is now stale. 
   * Refresh it the next time someone visits that page.
   */

  return newActor
}
