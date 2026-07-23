import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react'

import { CartActionButton } from '@/components/cart-action-button'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import { addToCart, removeFromCart } from '../cart/_actions/cart-actions'

import type { Crew, CrewOnMovie, Genre, Movie, MovieKeyword } from '@/generated/prisma/client'
import { WishlistButton } from '@/app/(public)/wishlist/_components/wishlist-button'

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
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-lg
        sm:rounded-xl
        bg-muted
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* Whole card clickable */}
      <Link
        href={`/movies/${movie.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${movie.title}`}
      />

      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden">
        <Image
          src={getMovieImageSrc(movie.imageUrl)}
          alt={movie.title}
          fill
          sizes="
            (max-width: 640px) 45vw,
            (max-width: 1024px) 30vw,
            220px
          "
          className="
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />

        {/* Wishlist */}
        <div className="absolute left-1.5 top-1.5 z-20 sm:left-3 sm:top-3">
          <WishlistButton
            movieId={movie.id}
            initialIsWishlisted={isWishlisted}
            size="icon"
            variant="secondary"
          />
        </div>

        {/* Rating */}
        <div
          className="
            absolute
            right-1.5
            top-1.5
            z-20
            flex
            items-center
            gap-0.5
            rounded-full
            bg-black/70
            px-1.5
            py-0.5
            text-[10px]
            font-semibold
            text-white
            sm:right-3
            sm:top-3
            sm:px-2
            sm:py-1
            sm:text-xs
          "
        >
          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400 sm:h-3 sm:w-3" />

          {movie.imdbRating?.toFixed(1) ?? '—'}
        </div>

        {/* Info */}
        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            z-20
            p-2
            text-white
            sm:p-3
          "
        >
          <h3
            className="
              truncate
              text-xs
              font-bold
              sm:text-sm
            "
          >
            {movie.title}
          </h3>

          <div
            className="
              mt-0.5
              flex
              items-center
              justify-between
              gap-1
            "
          >
            <span
              className="
                truncate
                text-[10px]
                text-white/70
                sm:text-xs
              "
            >
              {movie.genres
                .slice(0, 2)
                .map((g) => g.name)
                .join(' • ') || 'Movie'}
            </span>

            <span className="shrink-0 text-xs font-bold sm:text-sm">
              €{convertToEuro(movie.priceInCents)}
            </span>
          </div>
        </div>
      </div>

      {/* Cart */}
      <div className="relative z-20 bg-background p-1.5 sm:p-2">
        {quantity === 0 ? (
          <CartActionButton
            className="
              h-7
              w-full
              text-[11px]
              sm:h-8
              sm:text-xs
            "
            action={addToCart}
            movieId={movie.id}
            toastMessage="Added to cart"
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            Add
          </CartActionButton>
        ) : (
          <div className="flex gap-1">
            <CartActionButton
              className="h-7 flex-1 sm:h-8"
              action={async (movieId) => {
                'use server'
                await removeFromCart(movieId, true)
              }}
              movieId={movie.id}
              toastMessage="Removed from cart"
            >
              <Minus className="h-3 w-3" />
            </CartActionButton>

            <div className="flex h-7 flex-1 items-center justify-center rounded-md border text-xs sm:h-8">
              {quantity}
            </div>

            <CartActionButton
              className="h-7 flex-1 sm:h-8"
              action={addToCart}
              movieId={movie.id}
              toastMessage="Added to cart"
            >
              <Plus className="h-3 w-3" />
            </CartActionButton>
          </div>
        )}
      </div>
    </article>
  )
}
