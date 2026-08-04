'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { convertToEuro } from '@/lib/priceUtils'
import placeHolder from '@/public/file.svg'

type CarouselMovie = {
  id: string
  title: string
  backdropUrl: string | null
  priceInCents: number
  imdbRating: number | null
  genres: {
    id: number
    name: string
    description: string
  }[]
}

type Props = {
  movies: CarouselMovie[]
}

export default function HotDealsCarousel({ movies }: Props) {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  const movie = movies[index]

  const changeSlide = useCallback((newIndex: number) => {
    setFade(false)

    setTimeout(() => {
      setIndex(newIndex)
      setFade(true)
    }, 200)
  }, [])

  const next = useCallback(() => {
    changeSlide((index + 1) % movies.length)
  }, [changeSlide, index, movies.length])

  const prev = useCallback(() => {
    changeSlide((index - 1 + movies.length) % movies.length)
  }, [changeSlide, index, movies.length])

  useEffect(() => {
    if (movies.length <= 1) return

    const timer = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(timer)
  }, [next, movies.length])

  if (movies.length === 0) return null

  return (
    <div className="relative overflow-hidden border-y border-border bg-card shadow-lg">
      <Link href={`/movies/${movie.id}`}>
        <div
          className={`
            relative
            h-55
            w-full
            overflow-hidden
            transition-opacity
            duration-300
            md:h-170
            ${fade ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Movie Image */}
          <Image
            src={movie.backdropUrl ?? placeHolder.src}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            priority
            className="
            object-cover
            transition-transform
            duration-5000
            hover:scale-105
          "
          />

          {/* Image shadows ONLY */}
          <div
            className="
            absolute
            inset-0
            z-10
            bg-linear-to-r
            from-black/80
            via-black/30
            to-transparent
          "
          />

          <div
            className="
            absolute
            inset-x-0
            bottom-0
            z-10
            h-64
            bg-linear-to-t
            from-black/80
            via-black/40
            to-transparent
          "
          />

          {/* Hot Deals */}
          <div
            className="
            absolute
            left-6
            top-5
            z-20
            text-white
            md:left-9
          "
          >
            <h2 className="text-2xl font-bold drop-shadow-xl">🏷️ Hot Deals</h2>

            <p className="text-sm text-white/80 drop-shadow-lg">
              Grab your favorite movies at the best prices
            </p>
          </div>

          {/* Price */}
          <div
            className="
            absolute
            right-6
            top-5
            z-20
            rounded-full
            bg-red-600
            px-3
            py-1
            text-sm
            font-bold
            text-white
            shadow-lg
            md:right-9
          "
          >
            €{convertToEuro(movie.priceInCents)} ONLY
          </div>

          {/* Movie Info */}
          <div
            className="
            absolute
            bottom-14
            left-14
            right-14
            z-20
            max-w-lg
            text-white
            md:left-9
            md:right-auto
            md:bottom-16
          "
          >
            <h3
              className="
              text-2xl
              font-extrabold
              leading-tight
              drop-shadow-xl
              md:text-4xl
            "
            >
              {movie.title}
            </h3>

            <p
              className="
              mt-2
              text-sm
              text-white/85
              drop-shadow-lg
              md:text-base
            "
            >
              {movie.genres.map((g) => g.name).join(' • ') || 'No genres'}
              {' • '}⭐ {movie.imdbRating?.toFixed(1) ?? '—'}
            </p>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.preventDefault()
              prev()
            }}
            className="
            absolute
            left-3
            top-1/2
            z-30
            -translate-y-1/2
            rounded-full
            bg-black/50
            p-2
            text-white
            backdrop-blur
            transition
            hover:bg-primary
          "
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault()
              next()
            }}
            className="
            absolute
            right-3
            top-1/2
            z-30
            -translate-y-1/2
            rounded-full
            bg-black/50
            p-2
            text-white
            backdrop-blur
            transition
            hover:bg-primary
          "
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Dots */}
          <div
            className="
            absolute
            bottom-6
            left-1/2
            z-30
            flex
            -translate-x-1/2
            gap-2
          "
          >
            {movies.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault()
                  changeSlide(i)
                }}
                className={`
                h-2
                rounded-full
                transition-all
                ${i === index ? 'w-8 bg-white shadow-lg' : 'w-2 bg-white/50'}
              `}
              />
            ))}
          </div>
        </div>
      </Link>
    </div>
  )
}
