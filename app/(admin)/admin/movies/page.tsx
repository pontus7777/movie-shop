import MovieCard from '@/app/(public)/_components/movie-card'
import { MovieWithRelations } from '@/app/(public)/_components/shop-movie-card'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { MovieTable } from './_components/movie-table'

export default async function Page() {
  const movies = (await prisma.movie.findMany({
    include: {
      genres: true,
      credits: {
        include: {
          crew: true,
        },
      },
    },
    orderBy: {
      title: 'asc',
    },
  })) as MovieWithRelations[]

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between md:hidden">
        <div>
          <h2 className="text-2xl font-bold">Movies</h2>
          <p className="text-muted-foreground">Movies cards</p>
        </div>

        <Button asChild>
          <Link href="/admin/movies/create">Add Movie</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {movies.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </div>
      <div className="hidden md:block">
        <MovieTable movies={movies} />
      </div>
    </div>
  )
}
