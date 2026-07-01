'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { convertToEuro } from '@/lib/priceUtils'
import { MovieWithRelations } from './shop-movie-card'

type Props = {
  movies: MovieWithRelations[]
}

export default function HotDealsCarousel({ movies }: Props) {
  const [index, setIndex] = useState(0)

  if (movies.length === 0) return null

  const movie = movies[index]

  const next = () => setIndex((prev) => (prev + 1) % movies.length)
  const prev = () => setIndex((prev) => (prev - 1 + movies.length) % movies.length)

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative h-55 w-full md:h-70">
          <Image
            src={movie.backdropUrl ?? '/placeholder.jpg'}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            loading="eager"
            className="object-cover transition-opacity duration-500"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-4 left-4 rounded-md bg-red-600 px-3 py-1 text-sm font-bold text-white">
            €{convertToEuro(movie.priceInCents)} ONLY
          </div>

          <div className="absolute bottom-0 left-0 max-w-md p-6 text-white">
            <h3 className="mb-1 text-2xl font-bold">{movie.title}</h3>
            <p className="text-sm text-gray-300">
              {(movie.genres?.map((g) => g.name).join(' • ') || 'No genres') +
                ' • ⭐ ' +
                (movie.rating ? movie.rating.toFixed(1) : '—')}
            </p>
          </div>
        </div>
      </Link>

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-purple-600"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-purple-600"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
