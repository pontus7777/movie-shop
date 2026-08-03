'use server'

import { revalidatePath, updateTag } from 'next/cache'

import prisma from '@/lib/prisma'
import { convertFromEuro } from '@/lib/priceUtils'
import { requireAdmin } from '@/lib/session-validation'
import { editMovieSchema, type EditMovieInput } from '@/lib/validations/movie'

export async function editMovie(values: EditMovieInput) {
  await requireAdmin()
  const data = editMovieSchema.parse(values)

  const updatedMovie = await prisma.movie.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      priceInCents: convertFromEuro(parseFloat(data.price)),
      releaseYear: data.releaseYear,
      stock: data.stock,
      runtime: data.runtime,
      imageUrl: data.imageUrl.trim() || null,

      salePriceInCents: data.salePrice ? convertFromEuro(parseFloat(data.salePrice)) : null,
      saleStartsAt: data.saleStartsAt ? new Date(data.saleStartsAt) : null,
      saleEndsAt: data.saleEndsAt ? new Date(data.saleEndsAt) : null,

      // FIX: update credits correctly
      credits: {
        deleteMany: {}, // remove old credits
        create: data.crew.map((c) => ({
          crewId: c.id,
          role: c.role,
        })),
      },

      genres: {
        set: data.genreIds.map((id) => ({ id })),
      },
    },

    include: {
      credits: {
        include: { crew: true },
      },
      genres: true,
    },
  })

  revalidatePath('/admin/movies')
  updateTag('movies')

  return updatedMovie
}
