'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const createGenreSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

export async function createGenre(values: z.infer<typeof createGenreSchema>) {
  const data = createGenreSchema.parse(values)

  try {
    const newGenre = await prisma.genre.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })

    revalidatePath(`/admin/genres`)
    return newGenre
    
  } catch (error) {
    console.log('Error creating a genre', error)
    throw new Error('Faild to create a genre: ')
  }
}
