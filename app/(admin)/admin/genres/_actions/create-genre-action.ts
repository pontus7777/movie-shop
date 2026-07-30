'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'

const createGenreSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

export async function createGenre(values: z.infer<typeof createGenreSchema>) {
  await requireAdmin()
  const data = createGenreSchema.parse(values)

  try {
    const newGenre = await prisma.genre.create({
      data: {
        name: data.name,
        description: data.description,
      },
    })

    revalidatePath(`/admin/genres`)
    updateTag('movies')
    return newGenre
  } catch (error) {
    console.log('Error creating a genre', error)
    throw new Error('Faild to create a genre: ')
  }
}
