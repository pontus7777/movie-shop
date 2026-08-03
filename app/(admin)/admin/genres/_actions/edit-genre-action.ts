'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath, updateTag } from 'next/cache'
import { editGenreSchema, type EditGenreInput } from '@/lib/validations/genre'

export async function editGenre(values: EditGenreInput) {
  await requireAdmin()
  const data = editGenreSchema.parse(values)

  const updatedGenre = await prisma.genre.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  })

  revalidatePath('/admin/genres')
  updateTag('movies')

  return {
    ...updatedGenre,
  }
}
