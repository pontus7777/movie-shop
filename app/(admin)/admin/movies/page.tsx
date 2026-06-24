import Link from 'next/link'

import Moviecard from '@/components/moviecard'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { convertToSek } from '@/lib/priceUtils'
import { MovieTable } from '@/components/movie-table'

export default async function Page() {
  const movies = await prisma.movie.findMany({
    include: {
      genre:true,
      actors: true,
      directors: true,
    },
    orderBy: {
      title: 'asc',
    },
  })

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Movies</h2>
          <p className="text-muted-foreground">Movies cards</p>
        </div>

        <Button asChild>
          <Link href="/admin/movies/create">Add Movie</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {movies.map((m) => (
          <Moviecard
            key={m.id}
            movie={{
              ...m,
              price: convertToSek(m.price),
            }}
          />
        ))}
      </div>



    <MovieTable movies={movies}/>





    </div>
  )
}
