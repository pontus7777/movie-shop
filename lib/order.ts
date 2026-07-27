import prisma from './prisma'

export async function getPurchasedMovieIds(userId: string, movieIds: string[]) {
  if (movieIds.length === 0) return new Set<string>()

  const purchasedItems = await prisma.orderItem.findMany({
    where: {
      movieId: { in: movieIds },
      order: {
        userId,
        status: 'PAID',
      },
    },
    select: { movieId: true },
  })

  return new Set(purchasedItems.map((item) => item.movieId))
}
