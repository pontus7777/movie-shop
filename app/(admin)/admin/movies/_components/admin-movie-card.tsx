import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import { convertToEuro } from '@/lib/priceUtils'
import { MovieWithGenres } from '@/app/(public)/_components/movie-row'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'

export default function AdminMovieCard({
  movie,
  showDealBadge = false,
}: {
  movie: MovieWithGenres
  showDealBadge?: boolean
}) {
  if (!movie.imageUrl) return null

  const onSale = isMovieOnSale(movie)
  const effectivePrice = getEffectivePriceInCents(movie)

  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <article
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          bg-muted
          shadow-md
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        {/* Poster */}
        <div className="relative aspect-2/3 w-full overflow-hidden">
          <Image
            src={movie.imageUrl}
            alt={movie.title}
            fill
            sizes="
              (max-width: 640px) 140px,
              (max-width: 1024px) 180px,
              220px
            "
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-110
            "
          />

          {/* Dark gradient */}
          <div
            className="
              absolute
              inset-0
              bg-linear-to-t
              from-black/90
              via-black/20
              to-transparent
            "
          />

          {/* Sale badge — takes priority over the manual deal badge */}
          {onSale ? (
            <div
              className="
                absolute
                left-3
                top-3
                rounded-full
                bg-red-600
                px-3
                py-1
                text-xs
                font-bold
                text-white
                shadow-lg
              "
            >
              SALE
            </div>
          ) : (
            showDealBadge && (
              <div
                className="
                  absolute
                  left-3
                  top-3
                  rounded-full
                  bg-red-600
                  px-3
                  py-1
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                "
              >
                €{convertToEuro(movie.priceInCents)} ONLY
              </div>
            )
          )}

          {/* Rating */}
          <div
            className="
              absolute
              right-3
              top-3
              flex
              items-center
              gap-1
              rounded-full
              bg-black/70
              px-2
              py-1
              text-xs
              font-semibold
              text-white
              backdrop-blur
            "
          >
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {movie.imdbRating ? movie.imdbRating.toFixed(1) : '—'}
          </div>

          {/* Bottom info overlay */}
          <div
            className="
              absolute
              bottom-0
              left-0
              right-0
              p-3
              text-white
            "
          >
            <h3
              className="
                truncate
                text-sm
                font-bold
                sm:text-base
              "
            >
              {movie.title}
            </h3>

            <div className="mt-1 flex items-center justify-between gap-1">
              <p
                className="
                  line-clamp-1
                  text-xs
                  text-white/70
                "
              >
                {movie.genres.length ? movie.genres.map((g) => g.name).join(' • ') : 'No genres'}
              </p>

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
      </article>
    </Link>
  )
}