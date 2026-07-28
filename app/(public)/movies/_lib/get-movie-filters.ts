import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export async function getMovieFilters(where: Prisma.MovieWhereInput) {
  return Promise.all([
    prisma.genre.findMany({
      where: {
        movies: {
          some: where,
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),

    prisma.crew.findMany({
      where: {
        credits: {
          some: {
            role: 'DIRECTOR',
            movie: {
              is: where,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),

    prisma.crew.findMany({
      where: {
        credits: {
          some: {
            role: 'ACTOR',
            movie: {
              is: where,
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ])
}
