import Link from 'next/link'
import ShopMoviecard from '@/components/shop-movie-card'
import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { convertToSek } from '@/lib/priceUtils'
import { MovieTable } from '@/components/movies/movie-table'

export default async function Page() {
  const movies = await prisma.movie.findMany({
    include: {
      genres:true,
      crewMembers: true,
    },
    orderBy: {
      title: 'asc',
    },
  })

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
          <ShopMoviecard
            key={m.id}
            movie={{
              ...m,
              price: convertToSek(m.price),
            }}
          />
        ))}
      </div>
        <div className="hidden md:block">
          <MovieTable movies={movies}/>
        </div>
    </div>
  )
}
