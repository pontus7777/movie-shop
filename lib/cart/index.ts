import { headers } from 'next/headers'
import { Movie } from '@/generated/prisma/client'

import { auth } from '@/lib/auth'
import { getMoviesByIds } from '../services/movie'
import { getCookieCart } from './cookie-cart'
import { getDatabaseCart } from './db-cart'
export * from './cookie-cart'
export * from './db-cart'
export * from './merge-cart'

export type CartItem = {
  movie: Movie
  quantity: number
}

export type CartData = {
  items: CartItem[]
}

export async function getCart(): Promise<CartData> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    const cart = await getDatabaseCart(session.user.id)

    return {
      items:
        cart?.items.map((item) => ({
          movie: item.movie,
          quantity: item.quantity,
        })) ?? [],
    }
  }

  const cookieCart = await getCookieCart()

  const ids = Object.keys(cookieCart)

  if (ids.length === 0) {
    return {
      items: [],
    }
  }

  const movies = await getMoviesByIds(ids)

  return {
    items: movies.map((movie) => ({
      movie,
      quantity: cookieCart[movie.id],
    })),
  }
}
