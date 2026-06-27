'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { auth } from '@/lib/auth'
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
})

export async function editMovie(values: z.infer<typeof editMovieSchema>) {
  // Uncomment to enable auth
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // })

  // if (!session) {
  //   redirect('/sign-in')
  // }

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
    },
     include: {
          crewMembers: true,
        },
  })
  revalidatePath('/admin/movies')

  return {
    ...updatedMovie,
    price: data.price.toString(),
  }
}
