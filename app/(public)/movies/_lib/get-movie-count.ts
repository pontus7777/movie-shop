import { Prisma } from '@/generated/prisma/client'

import prisma from '@/lib/prisma'
import { cached, stableStringify } from '@/lib/cache'

export function getMovieCount(where: Prisma.MovieWhereInput) {
  return cached(
    () => {
      console.log('🔥 COUNT DATABASE HIT')

      return prisma.movie.count({ where })
    },
    ['movie-count', stableStringify(where)],
    ['movies'],
    3600,
  )()
}
