'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromEuro } from '@/lib/priceUtils'
import { requireAdmin } from '@/lib/session-validation'

const createMovieSchema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().min(1).max(1000),
  price: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must be a valid number like 21.29'),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.string(),

  crew: z
    .array(
      z.object({
        id: z.string(),
        role: z.enum(['ACTOR', 'DIRECTOR']),
      }),
    )
    .min(1, 'Select at least one crew member'),

  genreIds: z.array(z.number()).min(1, 'Select at least one genre'),
})

export async function createMovie(values: z.infer<typeof createMovieSchema>) {
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
    return newMovie
  } catch (error) {
    console.log('Error creating a movie', error)
    throw new Error('Faild to create a movie: ')
  }
}
