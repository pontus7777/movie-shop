import prisma from '@/lib/prisma'

export async function isMoviePurchased(userId: string, movieId: string): Promise<boolean> {
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      movieId,
      order: {
        userId,
        status: 'PAID',
      },
    },
    select: { id: true }, // only need existence, not full data
  })

  return orderItem !== null
}
