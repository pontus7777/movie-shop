'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromSek } from '@/lib/priceUtils'

const createMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number(),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.union([
    z.literal(""),
    z.string().url("Invalid URL"),
  ]),
  crewMemberIds: z.array(z.string()),
})

export async function createMovie(values: z.infer<typeof createMovieSchema>) {
  const data = createMovieSchema.parse(values)

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title: data.title,
        description: data.description,
        price: convertFromSek(data.price), // converts 149 sek to 14900 for example
        releaseYear: data.releaseYear,
        stock: data.stock,
        runtime: data.runtime,
        imageUrl: data.imageUrl.trim() === "" ? null : data.imageUrl,
        crewMembers: {
          connect: data.crewMemberIds.map((id) => ({ id })),
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
