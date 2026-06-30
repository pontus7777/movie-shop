import prisma from '@/lib/prisma'
import MovieCard from '@/components/movie-card'

export default async function SearchPage(props: PageProps<'/search'>) {
  const searchParams = await props.searchParams
  const query = typeof searchParams.q === 'string' ? searchParams.q.trim() : ''

  const movies = query
    ? await prisma.movie.findMany({
        where: {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        include: { genres: true },
        orderBy: { title: 'asc' },
      })
    : []

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">
        {query ? (
          <>
            Search results for <span className="text-purple-400">&ldquo;{query}&rdquo;</span>
          </>
        ) : (
          'Search'
        )}
      </h1>

      {query && movies.length === 0 && (
        <p className="text-muted-foreground">
          No movies found matching &ldquo;{query}&rdquo;. Try a different title.
        </p>
      )}

      {!query && (
        <p className="text-muted-foreground">
          Enter a movie title in the search bar above to get started.
        </p>
      )}

      {movies.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  )
}
