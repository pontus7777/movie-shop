'use server'

import { Genre } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export async function deleteGenre(genreId: Genre['id']): Promise<void> {
  prisma.genre.delete({
    where: {
      id: genreId,
    },
  })
}
