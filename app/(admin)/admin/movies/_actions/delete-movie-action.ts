'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

const deleteMovieSchema = z.string().min(1)

export async function deleteMovie(id: string) {
  await requireAdmin()
  const movieId = deleteMovieSchema.parse(id)

  await prisma.movie.delete({
    where: { id: movieId },
  })

  revalidatePath('/admin/movies')
  updateTag('movies')
}
