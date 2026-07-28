import Link from 'next/link'
import { Prisma } from '@/generated/prisma/client'

import MovieCard from './movie-card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'

export type MovieWithGenres = Prisma.MovieGetPayload<{
  include: {
    genres: true
  }
}>

type Props = {
  rowTitle?: string
  movies: MovieWithGenres[]
}
export function MovieRow({ rowTitle, movies }: Props) {
  return (
    <section className="py-5 sm:py-6">
      <div className="w-full px-4 sm:px-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{rowTitle}</h2>

          <Link
            href="/movies"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View all →
          </Link>
        </div>

        <Carousel
          opts={{
            align: 'start',
            dragFree: true,
            containScroll: 'trimSnaps',
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {movies.map((movie) => (
              <CarouselItem
                key={movie.id}
                className="
                  basis-[48%]
                  pl-4
                  sm:basis-[30%]
                  md:basis-[23%]
                  lg:basis-[18%]
                  xl:basis-[16.5%]
                "
              >
                <MovieCard movie={movie} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}
