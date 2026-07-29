import { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'
import { cached } from '@/lib/cache'

function stableStringify(obj: unknown) {
  return JSON.stringify(obj, Object.keys(obj as object).sort())
}

export function getMovieSidebarData(where: Prisma.MovieWhereInput) {
  const cacheKey = stableStringify(where)

  return cached(
    async () => {
      console.log('🔥 SIDEBAR DATABASE HIT')

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
    },
    ['movie-sidebar', cacheKey],
    ['movies'],
    3600,
  )()
}
