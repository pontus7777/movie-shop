import prisma from '@/lib/prisma'
import HotDealsCarousel from '@/app/(public)/_components/hot-deals-carousel'
import { MovieRow } from '@/app/(public)/_components/movie-row'

export default async function Home() {
  const cheapestMoviesRaw = await prisma.movie.findMany({
    include: { genres: true },
    orderBy: { priceInCents: 'asc' },
    take: 5,
  })

  // Convert Decimal -> plain number so it can be passed to a Client Component
  const cheapestMovies = cheapestMoviesRaw.map((movie) => ({
    ...movie,
    price: movie.priceInCents,
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
      <section className="border-b px-6 py-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
          Find Your Next <span className="text-purple-500">Favorite Movie</span>
        </h1>
        <p className="text-muted-foreground">Stay updated with what everyone&apos;s watching</p>
      </section>

      {/* ===== HOT DEALS BANNER SECTION ===== */}
      <section className="border-y border-purple-500/20 bg-purple-950/10 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-xl font-bold">🏷️ Hot Deals</h2>
            <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
              LIMITED TIME
            </span>
          </div>
          <p className="text-muted-foreground mb-4 text-sm">
            Grab your favorite movies at the best prices
          </p>

          <HotDealsCarousel movies={cheapestMovies} />
        </div>
      </section>

      {/* Most Purchased - placeholder until checkout/orders exist */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-2 text-xl font-bold">🔥 Most Purchased Movies</h2>
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
