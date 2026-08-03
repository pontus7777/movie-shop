'use server'

import { revalidatePath, updateTag } from 'next/cache'

import prisma from '@/lib/prisma'
import { convertFromEuro } from '@/lib/priceUtils'
import { requireAdmin } from '@/lib/session-validation'
import { createMovieSchema, type CreateMovieInput } from '@/lib/validations/movie'

export async function createMovie(values: CreateMovieInput) {
  await requireAdmin()
  const data = createMovieSchema.parse(values)

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        priceInCents: convertFromEuro(parseFloat(data.price)),
        releaseYear: data.releaseYear,
        stock: data.stock,
        runtime: data.runtime,
        imageUrl: data.imageUrl,

        salePriceInCents: data.salePrice ? convertFromEuro(parseFloat(data.salePrice)) : null,
        saleStartsAt: data.saleStartsAt ? new Date(data.saleStartsAt) : null,
        saleEndsAt: data.saleEndsAt ? new Date(data.saleEndsAt) : null,

        genres: {
          connect: data.genreIds.map((id) => ({ id })),
        },

        credits: {
          create: data.crew.map((c) => ({
            crewId: c.id,
            role: c.role,
          })),
        },
      },
    })

    revalidatePath(`/admin/movies`)
    updateTag('movies')
    return newMovie
  } catch (error) {
    console.log('Error creating a movie', error)
    throw new Error('Faild to create a movie: ')
  }
}
