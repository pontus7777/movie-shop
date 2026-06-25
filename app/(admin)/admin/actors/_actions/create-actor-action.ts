'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createActorSchema = z.object({
  name: z.string().min(1) .max(32, "Title must be less than 32 characters"),
})

export async function createActor(values: z.infer<typeof createActorSchema>) {
  const data = createActorSchema.parse(values)
  try {
    const newActor = await prisma.actor.create({
      data: {
        name: data.name,
      },
    })

    revalidatePath(`/admin/actors`)

    return newActor
  } catch (error) {
    console.log('Error creating an actor', error)
    throw new Error('Failed to create actor')
  }
}