'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromSek } from '@/lib/priceUtils'

const editMovieSchema = z.object({
  id: z.string().min(1),
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
  genreIds: z.array(z.number()),
})

export async function editMovie(values: z.infer<typeof editMovieSchema>) {
  const data = editMovieSchema.parse(values)

  const updatedMovie = await prisma.movie.update({
    where: {
      id: data.id,
    },
    data: {
      title: data.title,
      description: data.description,
      price: convertFromSek(data.price),
      releaseYear: data.releaseYear,
      stock: data.stock,
      runtime: data.runtime,
      imageUrl: data.imageUrl.trim() || null,
      crewMembers: {
          set: data.crewMemberIds.map((id) => ({ id })), //set replaces the existing list with the new selection
        },
      genres: {
        set: data.genreIds.map((id) => ({ id })),
      },
    },
     include: {
          crewMembers: true,
          genres: true,
        },
  })
  revalidatePath('/admin/movies')

  return {
    ...updatedMovie,
    price: data.price.toString(),
  }
}
