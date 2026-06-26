import prisma from '@/lib/prisma'
import MovieCard from '@/components/movie-card'
import { Movie, Genre } from '@/generated/prisma/client'
import HotDealsCarousel from '@/components/hot-deals-carousel'
import { MovieRow } from '@/components/movie-row'

// type MovieWithGenre = Movie & {
//   genres: Genre[] | null;
// };

export default async function Home() {
  const cheapestMoviesRaw = await prisma.movie.findMany({
    include: { genres: true },
    orderBy: { price: 'asc' },
    take: 5,
  })

  // Convert Decimal -> plain number so it can be passed to a Client Component
  const cheapestMovies = cheapestMoviesRaw.map((movie) => ({
    ...movie,
    price: movie.price,
  }))

  const recentMovies = await prisma.movie.findMany({
    include: { genres: true },
    orderBy: { releaseYear: 'desc' },
    take: 5,
  })

  const popularMovies = await prisma.movie.findMany({
    include: { genres: true },
    orderBy: { rating: 'desc' },
    take: 5,
  })

  const oldestMovies = await prisma.movie.findMany({
    include: { genres: true },
    orderBy: { releaseYear: 'asc' },
    take: 5,
  })

  return (
    <main className="bg-background text-foreground">
      {/* ===== HERO ===== */}
      <section className="border-b py-12 px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          Find Your Next <span className="text-purple-500">Favorite Movie</span>
        </h1>
        <p className="text-muted-foreground">Stay updated with what everyone&apos;s watching</p>
      </section>

      {/* ===== HOT DEALS BANNER SECTION ===== */}
      <section className="py-8 bg-purple-950/10 border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold">🏷️ Hot Deals</h2>
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
              LIMITED TIME
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Grab your favorite movies at the best prices
          </p>

          <HotDealsCarousel movies={cheapestMovies} />
        </div>
      </section>

      {/* Most Purchased - placeholder until checkout/orders exist */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-xl font-bold mb-2">🔥 Most Purchased Movies</h2>
          <p className="text-muted-foreground text-sm">
            Coming soon — this section will show real data once checkout and orders are implemented.
          </p>
        </div>
      </section>

      <MovieRow rowTitle="Most Recent Movies" movies={recentMovies} />
      <MovieRow rowTitle="Popular Movies" movies={popularMovies} />
      <MovieRow rowTitle="Oldest Movies" movies={oldestMovies} />
    </main>
  )
}
