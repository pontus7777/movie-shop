import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

import { MovieCartButton } from './movie-cart-button'
import { WishlistButton } from '@/app/(public)/wishlist/_components/wishlist-button'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'

import type {
  Crew,
  CrewOnMovie,
  Genre,
  Movie,
  MovieKeyword,
} from '@/generated/prisma/client'

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

export default function ShopMovieCard({
  movie,
  quantity,
  isWishlisted,
}: Props) {
  const onSale = isMovieOnSale(movie)
  const effectivePrice = getEffectivePriceInCents(movie)

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-lg
        bg-muted
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        sm:rounded-xl
      "
    >
      <Link
        href={`/movies/${movie.id}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${movie.title}`}
      />

      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={getMovieImageSrc(movie.imageUrl)}
          alt={movie.title}
          fill
          quality={100}
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

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />

        <div className="absolute left-1.5 top-1.5 z-20 sm:left-3 sm:top-3">
          <WishlistButton
            movieId={movie.id}
            initialIsWishlisted={isWishlisted}
            size="icon"
            variant="secondary"
          />

          {onSale && (
            <div className="mt-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white sm:text-xs">
              SALE
            </div>
          )}
        </div>

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
            backdrop-blur
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
          <div className="flex items-end justify-between gap-2">
            <h3
              className="
                flex-1
                truncate
                text-xs
                font-bold
                sm:text-sm
              "
            >
              {movie.title}
            </h3>

            <div className="flex shrink-0 items-baseline gap-1">
              <span className="text-xs font-bold sm:text-sm">
                €{convertToEuro(effectivePrice)}
              </span>

              {onSale && (
                <span className="text-[10px] text-white/60 line-through sm:text-xs">
                  €{convertToEuro(movie.priceInCents)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="
          relative
          z-20
          border-t
          border-border
          bg-card
          p-1.5
          sm:p-2
        "
      >
        <MovieCartButton
          movieId={movie.id}
          initialQuantity={quantity}
        />
      </div>
    </article>
  )
}