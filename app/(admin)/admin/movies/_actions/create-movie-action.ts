'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromEuro } from '@/lib/priceUtils'
import { requireAdmin } from '@/lib/session-validation'

const createMovieSchema = z
  .object({
    title: z.string().min(1).max(32),
    description: z.string().min(1).max(1000),
    price: z
      .string()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must be a valid number like 21.29'),
    releaseYear: z.number().min(0).max(9999),
    stock: z.boolean(),
    runtime: z.number().min(10),
    imageUrl: z.string(),

    salePrice: z
      .string()
      .refine(
        (val) => val === '' || /^\d+(\.\d{1,2})?$/.test(val),
        'Sale price must be a valid number like 4.99, or empty',
      ),
    saleStartsAt: z.string(), // datetime-local string, or '' for none
    saleEndsAt: z.string(),

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
  .refine(
    (data) => {
      if (!data.saleStartsAt || !data.saleEndsAt) return true
      return new Date(data.saleEndsAt) > new Date(data.saleStartsAt)
    },
    { message: 'Sale end date must be after the start date', path: ['saleEndsAt'] },
  )

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
