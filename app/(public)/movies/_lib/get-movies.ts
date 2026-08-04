import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { cached, stableStringify } from '@/lib/cache'
import { movieCardSelect } from './movie-card-select'

export function getMovies(where: Prisma.MovieWhereInput, skip: number, take: number) {
  return cached(
    () => {
      console.log('🔥 MOVIES DATABASE HIT')

      return prisma.movie.findMany({
        where,
        orderBy: {
          popularity: 'desc',
        },
        skip,
        take,
        select: movieCardSelect,
      })
    },
    ['movies', stableStringify(where), String(skip), String(take)],
    ['movies'],
    300,
  )()
}
