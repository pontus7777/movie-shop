'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath, updateTag } from 'next/cache'
import { createGenreSchema, type CreateGenreInput } from '@/lib/validations/genre'

export async function createGenre(values: CreateGenreInput) {
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
