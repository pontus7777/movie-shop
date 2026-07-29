import { Prisma } from '@/generated/prisma/client'

export const movieCardSelect = {
  id: true,
  title: true,
  imageUrl: true,
  imdbRating: true,
  priceInCents: true,
  salePriceInCents: true,
  saleStartsAt: true,
  saleEndsAt: true,
} satisfies Prisma.MovieSelect
