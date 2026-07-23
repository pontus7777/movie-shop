import prisma from '@/lib/prisma'

const movieInclude = {
  genres: true,
}

function sortByIds<T extends { id: string }>(ids: string[], items: T[]) {
  return ids
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is T => item !== undefined)
}

export async function getHomepageMovies() {
  const [cheapestMoviesRaw, recentMovies, popularMovies, oldestMovies, mostPurchasedGroups] =
    await Promise.all([
      prisma.movie.findMany({
        include: movieInclude,
        orderBy: {
          priceInCents: 'asc',
        },
        take: 10,
      }),

      prisma.movie.findMany({
        include: movieInclude,
        orderBy: {
          releaseYear: 'desc',
        },
        take: 15,
      }),

      prisma.movie.findMany({
        include: movieInclude,
        orderBy: {
          imdbRating: 'desc',
        },
        take: 15,
      }),

      prisma.movie.findMany({
        include: movieInclude,
        orderBy: {
          releaseYear: 'asc',
        },
        take: 15,
      }),

      prisma.orderItem.groupBy({
        by: ['movieId'],
        where: {
          order: {
            status: 'PAID',
          },
        },
        _sum: {
          quantity: true,
        },
        orderBy: {
          _sum: {
            quantity: 'desc',
          },
        },
        take: 15,
      }),
    ])

  const cheapestMovies = cheapestMoviesRaw.map((movie) => ({
    ...movie,
    price: movie.priceInCents,
  }))

  const purchasedMovieIds = mostPurchasedGroups.map((item) => item.movieId)

  const purchasedMovies = await prisma.movie.findMany({
    where: {
      id: {
        in: purchasedMovieIds,
      },
    },
    include: movieInclude,
  })

  const mostPurchasedMovies = sortByIds(purchasedMovieIds, purchasedMovies)

  return {
    cheapestMovies,
    recentMovies,
    popularMovies,
    oldestMovies,
    mostPurchasedMovies,
  }
}
