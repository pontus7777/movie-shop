import HotDealsCarousel from '@/app/(public)/_components/hot-deals-carousel'
import { MovieRow } from '@/app/(public)/_components/movie-row'
import { getHomepageMovies } from '@/app/(public)/_queries/movie-queries'

export default async function Home() {
  const { cheapestMovies, recentMovies, popularMovies, oldestMovies, mostPurchasedMovies } =
    await getHomepageMovies()

  return (
    <main className="bg-background text-foreground">
      <section className="border-b px-6 py-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
          Find Your Next <span className="text-purple-500">Favorite Movie</span>
        </h1>

        <p className="text-muted-foreground">Stay updated with what everyone&apos;s watching</p>
      </section>

      <section className="border-y border-purple-500/20 bg-purple-950/10 py-8">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-1 text-xl font-bold">🏷️ Hot Deals</h2>

          <p className="text-muted-foreground mb-4 text-sm">
            Grab your favorite movies at the best prices
          </p>

          <HotDealsCarousel movies={cheapestMovies} />
        </div>
      </section>

      {mostPurchasedMovies.length > 0 && (
        <MovieRow rowTitle="🔥 Most Purchased Movies" movies={mostPurchasedMovies} />
      )}

      <MovieRow rowTitle="Most Recent Movies" movies={recentMovies} />

      <MovieRow rowTitle="Popular Movies" movies={popularMovies} />

      <MovieRow rowTitle="Oldest Movies" movies={oldestMovies} />
    </main>
  )
}
