'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'

const deleteGenreSchema = z.number().int()

export async function deleteGenre(id: number) {
  await requireAdmin()
  const genreId = deleteGenreSchema.parse(id)
  await prisma.genre.delete({
    where: { id: genreId },
  })

  revalidatePath('/admin/genres')
  updateTag('movies')
}
