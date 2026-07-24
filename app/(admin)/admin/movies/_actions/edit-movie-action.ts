'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromEuro } from '@/lib/priceUtils'
import { requireAdmin } from '@/lib/session-validation'

const editMovieSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1).max(50),
    description: z.string().min(1).max(1000),
    price: z
      .string()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must be a valid number like 21.29'),
    releaseYear: z.number().min(0).max(9999),
    stock: z.boolean(),
    runtime: z.number().min(10),
    imageUrl: z.union([z.literal(''), z.string().url('Invalid URL')]),

    salePrice: z
      .string()
      .refine(
        (val) => val === '' || /^\d+(\.\d{1,2})?$/.test(val),
        'Sale price must be a valid number like 4.99, or empty',
      ),
    saleStartsAt: z.string(), // datetime-local string, or '' for none
    saleEndsAt: z.string(),

    // FIX: crew must include roles
    crew: z.array(
      z.object({
        id: z.string(),
        role: z.enum(['ACTOR', 'DIRECTOR']),
      }),
    ),

    genreIds: z.array(z.number()),
  })
  .refine(
    (data) => {
      if (!data.saleStartsAt || !data.saleEndsAt) return true
      return new Date(data.saleEndsAt) > new Date(data.saleStartsAt)
    },
    { message: 'Sale end date must be after the start date', path: ['saleEndsAt'] },
  )

export async function editMovie(values: z.infer<typeof editMovieSchema>) {
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

  return updatedMovie
}
