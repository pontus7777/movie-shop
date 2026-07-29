import { unstable_cache } from 'next/cache'
import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export async function getMovieFilters(where: Prisma.MovieWhereInput) {
  return getCachedMovieFilters(JSON.stringify(where))
}

const getCachedMovieFilters = unstable_cache(
  async (whereString: string) => {
    console.log('🔥 FILTERS DATABASE HIT')

    const where = JSON.parse(whereString) as Prisma.MovieWhereInput

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
  },
  ['movie-filters'],
  {
    revalidate: 300,
  },
)
