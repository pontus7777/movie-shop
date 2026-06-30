import { Prisma } from '@/generated/prisma/client'
import MovieCard from './movie-card'

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
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl font-bold mb-4">{rowTitle}</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {movies.map((movie) => (
            <div key={movie.id} className="shrink-0 w-57.5">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
