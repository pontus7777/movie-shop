import Image from 'next/image'
import Link from 'next/link'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getMovieImageSrc } from '@/lib/image-utils'
import { Crew, CrewOnMovie, Genre, Movie, MovieKeyword } from '@/generated/prisma/client'
import { CartActionButton } from '@/components/cart-action-button'
import { addToCart, removeFromCart } from '../cart/_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'
import { Minus, Plus } from 'lucide-react'
import { WishlistButton } from '../wishlist/components/wishlist-button'

export type MovieWithRelations = Movie & {
  genres: Genre[]
  keywords: MovieKeyword[]
  credits: (CrewOnMovie & { crew: Crew })[]
}

type Props = {
  movie: MovieWithRelations
  quantity: number
  isWishlisted: boolean
}

export default function ShopMovieCard({ movie, quantity, isWishlisted }: Props) {
  const imageSrc = getMovieImageSrc(movie.imageUrl)

  return (
    <Card className="flex w-56 flex-col overflow-hidden rounded-md">
      {/* Movie Poster */}
      <div className="relative">
        <Image
          src={imageSrc}
          alt={movie.title}
          width={300}
          height={450}
          className="aspect-2/3 w-full rounded-t-md object-cover"
        />

        <div className="absolute top-2 right-2">
          <WishlistButton
            movieId={movie.id}
            initialIsWishlisted={isWishlisted}
            size="icon"
            variant="secondary"
          />
        </div>
      </div>

      {/* Header */}
      <CardHeader className="py-2">
        <CardTitle className="space-y-0.5 text-sm leading-tight font-semibold">
          <Link href={`/movies/${movie.id}`} className="underline-offset-2 hover:underline">
            {movie.title}
          </Link>

          <span className="text-muted-foreground block text-xs">⭐ {movie.rating?.toFixed(1)}</span>
        </CardTitle>
      </CardHeader>

      {/* Footer */}
      <CardContent className="flex h-full flex-col px-3 pt-0 pb-3">
        {movie.tagline && (
          <p className="text-muted-foreground mb-1 line-clamp-2 text-xs">{movie.tagline}</p>
        )}

        <p className="mb-2 text-base font-bold tracking-tight">
          €{convertToEuro(movie.priceInCents)}
        </p>

        {quantity > 0 && (
          <div className="text-muted-foreground mb-2 text-xs font-medium">Count: {quantity}</div>
        )}

        <div className="mt-auto flex gap-2">
          {quantity === 0 ? (
            <CartActionButton
              className="w-full"
              action={addToCart}
              movieId={movie.id}
              toastMessage="Succesfully added to cart"
            >
              Add to Cart
            </CartActionButton>
          ) : (
            <>
              <CartActionButton
                className="w-1/2"
                action={async (movieId) => {
                  'use server'
                  await removeFromCart(movieId, true)
                }}
                movieId={movie.id}
                toastMessage="Removed from cart"
              >
                <Minus />
              </CartActionButton>

              <CartActionButton
                className="w-1/2"
                action={addToCart}
                movieId={movie.id}
                toastMessage="Added to cart"
              >
                <Plus />
              </CartActionButton>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
