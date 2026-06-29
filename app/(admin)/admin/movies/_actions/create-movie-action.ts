'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import prisma from '@/lib/prisma'
import { convertFromSek } from '@/lib/priceUtils'
import { CrewRole } from '@/generated/prisma/client'

const createMovieSchema = z.object({
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number(),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.union([z.literal(''), z.string().url('Invalid URL')]),
  crewMembers: z
    .array(
      z.object({
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
})

export async function createMovie(values: z.infer<typeof createMovieSchema>) {
  const data = createMovieSchema.parse(values)

  try {
    const newMovie = await prisma.$transaction(async (tx) => {
      // =========================
      // Create Movie
      // =========================
      const movie = await tx.movie.create({
        data: {
          title: data.title,
          description: data.description,
          price: convertFromSek(data.price),
          releaseYear: data.releaseYear,
          stock: data.stock,
          runtime: data.runtime,
          imageUrl: data.imageUrl.trim() === '' ? null : data.imageUrl,

          // Connect selected genres while creating the movie
          genres: {
            connect: data.genreIds.map((id) => ({ id })),
          },
        },
      })

      // =========================
      // Process Crew Members
      // =========================

      for (const member of data.crewMembers) {
        // ===============================================
        // Find crew member by name
        // ===============================================

        let crew = await tx.crew.findUnique({
          where: {
            name: member.name,
          },
        })

        // ===============================================
        // Create crew member if it doesn't exist
        // ===============================================

        if (!crew) {
          crew = await tx.crew.create({
            data: {
              name: member.name,
            },
          })
        }

        // ===============================================
        // Create ACTOR relation
        // ===============================================

        if (member.actor) {
          await tx.crewOnMovie.create({
            data: {
              movieId: movie.id,
              crewId: crew.id,
              role: CrewRole.ACTOR,
            },
          })
        }

        // ===============================================
        // Create DIRECTOR relation
        // ===============================================

        if (member.director) {
          await tx.crewOnMovie.create({
            data: {
              movieId: movie.id,
              crewId: crew.id,
              role: CrewRole.DIRECTOR,
            },
          })
        }
      }

      return movie
    })

    revalidatePath('/admin/movies')

    return newMovie
  } catch (error) {
    console.error(error)
    throw new Error('Failed to create movie')
  }
}
