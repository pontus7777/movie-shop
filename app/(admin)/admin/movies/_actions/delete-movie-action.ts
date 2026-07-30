'use server'

import { revalidatePath, updateTag } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'

export async function deleteMovie(id: string) {
  await requireAdmin()

  await prisma.movie.delete({
    where: { id },
  })

  revalidatePath('/admin/movies')
  updateTag('movies')
}
