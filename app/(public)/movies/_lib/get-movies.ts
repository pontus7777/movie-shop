import { unstable_cache } from 'next/cache'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { movieInclude } from './movie-include'
import { MovieWithRelations } from '../../_components/shop-movie-card'

export async function getMovies(where: Prisma.MovieWhereInput, skip: number, take: number) {
  return getCachedMovies(JSON.stringify(where), skip, take)
}

const getCachedMovies = unstable_cache(
  async (whereString: string, skip: number, take: number) => {
    console.log('🔥 MOVIES DATABASE HIT')

    const where = JSON.parse(whereString)

    return prisma.movie.findMany({
      where,
      orderBy: {
        popularity: 'desc',
      },
      skip,
      take,
      include: movieInclude,
    }) as Promise<MovieWithRelations[]>
  },
  ['movies'],
  {
    revalidate: 300,
  },
)
