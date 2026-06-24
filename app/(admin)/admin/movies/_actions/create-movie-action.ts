'use server'

import { Decimal } from '@prisma/client/runtime/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'

const createMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .min(1),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
})

export async function createMovie(values: z.infer<typeof createMovieSchema>) {
  const data = createMovieSchema.parse(values)

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        price: new Decimal(data.price),
        releaseYear: data.releaseYear,
        stock: data.stock,
        runtime: data.runtime,
      },
    })
    revalidatePath(`/admin/movies`)
    return newMovie
  } catch (error) {
    console.log('Error creating a movie', error)
    throw new Error('Faild to create a movie: ')
  }
}
