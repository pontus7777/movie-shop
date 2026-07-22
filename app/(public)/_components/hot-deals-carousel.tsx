'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { convertToEuro } from '@/lib/priceUtils'

type CarouselMovie = {
  id: string
  title: string
  backdropUrl: string | null
  priceInCents: number
  rating: number | null
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

  // Auto slide
  useEffect(() => {
    if (movies.length <= 1) return

    const timer = setInterval(() => {
      next()
    }, 5000)

    return () => clearInterval(timer)
  }, [next, movies.length])

  if (movies.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-xl">
      <Link href={`/movies/${movie.id}`}>
        <div
          className={`
            relative
            h-55
            w-full
            overflow-hidden
            transition-opacity
            duration-300
            md:h-110
            ${fade ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <Image
            src={movie.backdropUrl ?? '/placeholder.jpg'}
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

          {/* Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-linear-to-r
              from-black/80
              via-black/40
              to-transparent
            "
          />

          {/* Price badge */}
          <div
            className="
              absolute
              left-4
              top-4
              rounded-full
              bg-red-600
              px-3
              py-1
              text-sm
              font-bold
              text-white
              shadow-lg
            "
          >
            €{convertToEuro(movie.priceInCents)} ONLY
          </div>

          {/* Movie info */}
          <div
            className="
              absolute
              bottom-0
              left-0
              max-w-md
              p-5
              text-white
              md:p-8
            "
          >
            <h3 className="text-xl font-bold md:text-3xl">{movie.title}</h3>

            <p className="mt-2 text-sm text-white/70">
              {movie.genres.map((g) => g.name).join(' • ') || 'No genres'}
              {' • '}⭐ {movie.rating?.toFixed(1) ?? '—'}
            </p>
          </div>
        </div>
      </Link>

      {/* Previous */}
      <button
        onClick={prev}
        className="
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          rounded-full
          bg-black/50
          p-2
          text-white
          backdrop-blur
          transition
          hover:bg-purple-600
        "
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Next */}
      <button
        onClick={next}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          rounded-full
          bg-black/50
          p-2
          text-white
          backdrop-blur
          transition
          hover:bg-purple-600
        "
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div
        className="
          absolute
          bottom-3
          right-1/2
          flex
          translate-x-1/2
          gap-2
        "
      >
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => changeSlide(i)}
            className={`
              h-2
              w-2
              rounded-full
              transition-all
              ${i === index ? 'w-6 bg-white' : 'bg-white/50'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
