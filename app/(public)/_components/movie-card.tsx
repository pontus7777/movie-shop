import Link from 'next/link'
import { Star } from 'lucide-react'
import { MovieWithGenres } from './movie-row'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import { PosterImage } from './poster-image'

export default function MovieCard({
  movie,
  showDealBadge = false,
}: {
  movie: MovieWithGenres
  showDealBadge?: boolean
}) {
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
        <div className="relative aspect-2/3 min-h-75 w-full overflow-hidden">
          <PosterImage
            src={getMovieImageSrc(movie.imageUrl)}
            alt={movie.title}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Deal badge */}
          {showDealBadge && (
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
        </div>
      </article>
    </Link>
  )
}
