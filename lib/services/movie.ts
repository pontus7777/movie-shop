import prisma from '@/lib/prisma'

export async function getMovies() {
  return prisma.movie.findMany({
    orderBy: {
      title: 'asc',
    },
  })
}

export async function getMoviesByIds(ids: string[]) {
  if (ids.length === 0) {
    return []
  }

  return prisma.movie.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  })
}
