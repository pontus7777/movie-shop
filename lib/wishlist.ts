import prisma from './prisma'

export async function getDatabaseWishlist(userId: string) {
  const wishlist = await prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })

  return prisma.wishlist.findUnique({
    where: { id: wishlist.id },
    include: {
      items: {
        include: { movie: true },
        orderBy: { id: 'asc' },
      },
    },
  })
}

export async function isMovieInWishlist(userId: string, movieId: string) {
  const item = await prisma.wishlistItem.findFirst({
    where: { movieId, wishlist: { userId } },
  })
  return !!item
}

export async function addToDatabaseWishlist(userId: string, movieId: string) {
  const wishlist = await prisma.wishlist.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })

  return prisma.wishlistItem.upsert({
    where: {
      wishlistId_movieId: { wishlistId: wishlist.id, movieId },
    },
    update: {},
    create: { wishlistId: wishlist.id, movieId },
  })
}

export async function removeFromDatabaseWishlist(userId: string, movieId: string) {
  const wishlist = await prisma.wishlist.findUnique({ where: { userId } })
  if (!wishlist) return

  return prisma.wishlistItem.deleteMany({
    where: { wishlistId: wishlist.id, movieId },
  })
}

export async function toggleDatabaseWishlist(userId: string, movieId: string) {
  const inWishlist = await isMovieInWishlist(userId, movieId)

  if (inWishlist) {
    await removeFromDatabaseWishlist(userId, movieId)
    return { wishlisted: false }
  }

  await addToDatabaseWishlist(userId, movieId)
  return { wishlisted: true }
}
export async function getWishlistedMovieIds(userId: string): Promise<Set<string>> {
  const items = await prisma.wishlistItem.findMany({
    where: { wishlist: { userId } },
    select: { movieId: true },
  })
  return new Set(items.map((item) => item.movieId))
}
