import { Prisma } from '@/generated/prisma/client'

import prisma from '@/lib/prisma'
import { cached } from '@/lib/cache'

function stableStringify(obj: unknown) {
  return JSON.stringify(obj, Object.keys(obj as object).sort())
}

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
