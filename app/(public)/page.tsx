import HotDealsCarousel from '@/app/(public)/_components/hot-deals-carousel'
import { MovieRow } from '@/app/(public)/_components/movie-row'
import { getHomepageMovies } from '@/app/(public)/_queries/movie-queries'

export default async function Home() {
  const { cheapestMovies, recentMovies, popularMovies, oldestMovies, mostPurchasedMovies } =
    await getHomepageMovies()

  return (
    <main className="bg-background text-foreground">
      {/* Page intro */}
      <section
        className="
    px-4
    pt-8
    pb-5
    text-center
    sm:px-8
  "
      >
        <h1
          className="
      text-2xl
      font-bold
      tracking-tight
      sm:text-3xl
    "
        >
          Find Your Next <span className="text-primary">Favorite Movie</span>
        </h1>

        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Explore new releases, popular picks, and timeless classics.
        </p>
      </section>

      {/* Hero carousel */}
      <section
        className="
      relative
      h-[45vh]
      min-h-[320px]
      w-full
      overflow-hidden
      sm:h-[55vh]
      lg:h-[65vh]
    "
      >
        <HotDealsCarousel movies={cheapestMovies} />
      </section>

      {/* Movie rows */}
      <div className="space-y-2 py-10">
        {mostPurchasedMovies.length > 0 && (
          <MovieRow rowTitle="🔥 Most Purchased Movies" movies={mostPurchasedMovies} />
        )}

        <MovieRow rowTitle="Most Recent Movies" movies={recentMovies} />

        <MovieRow rowTitle="Popular Movies" movies={popularMovies} />

        <MovieRow rowTitle="Oldest Movies" movies={oldestMovies} />
      </div>
    </main>
  )
}
