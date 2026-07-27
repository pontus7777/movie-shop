import HotDealsCarousel from '@/app/(public)/_components/hot-deals-carousel'
import { MovieRow } from '@/app/(public)/_components/movie-row'
import { getHomepageMovies } from '@/app/(public)/_queries/movie-queries'

export default async function Home() {
  const { cheapestMovies, recentMovies, popularMovies, oldestMovies, mostPurchasedMovies } =
    await getHomepageMovies()

  return (
    <main className="bg-background text-foreground">
      <section className="border-b px-2 py-4 text-center">
        <h1 className="mb-2 text-1xl font-extrabold md:text-2xl">
          Find Your Next <span className="text-primary">Favorite Movie</span>
        </h1>

        <p className="text-muted-foreground">Stay updated with what everyone&apos;s watching</p>
      </section>

      <section className="relative h-[63vh] w-7x1 overflow-hidden">
        {/* Fullscreen Carousel */}
        <HotDealsCarousel movies={cheapestMovies} />

        {/* Gradient overlay for readability */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />
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
