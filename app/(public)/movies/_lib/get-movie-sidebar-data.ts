import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export async function getMovieSidebarData(where: Prisma.MovieWhereInput) {
  const [genres, directors, actors] = await Promise.all([
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

  return {
    genres,
    directors,
    actors,
  }
}
