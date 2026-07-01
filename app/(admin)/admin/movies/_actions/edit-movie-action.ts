'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromSek } from '@/lib/priceUtils'
import { CrewRole } from '@/generated/prisma/client'
import { convertFromEuro } from '@/lib/priceUtils'

const editMovieSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number(),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.union([z.literal(''), z.string().url('Invalid URL')]),
  credits: z
    .array(
      z.object({
        crewId: z.string(),
        name: z.string().trim().min(1, 'Crew member name is required'),
        actor: z.boolean(),
        director: z.boolean(),
      }),
    )
    .min(1, 'At least one crew member is required')
    .refine((crew) => crew.every((member) => member.actor || member.director), {
      message: 'Each crew member must have at least one role.',
    }),
  genreIds: z.array(z.number()),

  //   id: z.string().min(1),
  //   title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  //   description: z.string().min(1, 'Description is required').max(1000),
  //   price: z.number(),
  //   releaseYear: z.number().min(0).max(9999),
  //   stock: z.boolean(),
  //   runtime: z.number().min(10),
  //   imageUrl: z.union([
  //       z.literal(""),
  //       z.string().url("Invalid URL"),
  // ]),
  //   crewMemberIds: z.array(z.string()),
  //   genreIds: z.array(z.number()),
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
      price: convertFromEuro(data.price),
      releaseYear: data.releaseYear,
      stock: data.stock,
      runtime: data.runtime,
      imageUrl: data.imageUrl.trim() || null,

      genres: {
        set: data.genreIds.map((id) => ({ id })),
      },

      credits: {
        deleteMany: {},

        create: data.credits.flatMap((member) => [
          ...(member.actor
            ? [
                {
                  role: CrewRole.ACTOR,

                  crew: {
                    connectOrCreate: {
                      where: {
                        name: member.name,
                      },
                      create: {
                        name: member.name,
                      },
                    },
                  },
                },
              ]
            : []),

          ...(member.director
            ? [
                {
                  role: CrewRole.DIRECTOR,

                  crew: {
                    connectOrCreate: {
                      where: {
                        name: member.name,
                      },
                      create: {
                        name: member.name,
                      },
                    },
                  },
                },
              ]
            : []),
        ]),
      },
    },
  })

  revalidatePath('/admin/movies')

  return {
    ...updatedMovie,
    price: data.price.toString(),
  }
}
