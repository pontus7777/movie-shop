// app/(shop)/movies/page.tsx
import prisma from '@/lib/prisma'
import ShopMovieCard, { MovieWithRelations } from '../_components/shop-movie-card'
import { MoviesPagination } from './_components/movies-pagination'
import { getCart } from '@/lib/cart'

export default async function MoviesPage(props: PageProps<'/movies'>) {
  const params = await props.searchParams
  const pageSize = 12

  const page = Number(params.page) || 1
  const query = typeof params.q === 'string' ? params.q.trim() : '' // ★ NEW — reads ?q= from URL

  const skip = (page - 1) * pageSize

  // ★ NEW — was just { stock: true }, now also filters by title when query exists
  const where = {
    stock: true,
    ...(query && {
      title: {
        contains: query,
        mode: 'insensitive' as const,
      },
    }),
  }

  const movies = (await prisma.movie.findMany({
    where, // ★ CHANGED — was where: { stock: true }, now uses the variable above
    orderBy: { popularity: 'desc' },
    skip,
    take: pageSize,
    include: {
      genres: true,
      keywords: true,
      credits: {
        include: { crew: true },
      },
    },
  })) as MovieWithRelations[]

  const total = await prisma.movie.count({ where }) // ★ CHANGED — was where: { stock: true }, now uses variable so count matches the filter

  const totalPages = Math.ceil(total / pageSize)

  const cart = await getCart()

  return (
    <div className="min-h-lvh space-y-4 p-6">
      <h1 className="text-2xl font-bold">Movies</h1>
      {/* ★ NEW — only shows when there's an active search query */}
      {query && (
        <p className="text-sm text-muted-foreground">
          Showing results for{' '}
          <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span> — {total}{' '}
          {total === 1 ? 'movie' : 'movies'} found
        </p>
      )}
      <div className="flex justify-center">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {/* ★ CHANGED — was movies.map(...) directly, now checks for empty results first */}
          {movies.length > 0 ? (
            movies.map((movie) => {
              const quantity = cart[movie.id] ?? 0
              return <ShopMovieCard key={movie.id} movie={movie} quantity={quantity} />
            })
          ) : (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              No movies found matching &ldquo;{query}&rdquo;. {/* ★ NEW */}
            </p>
          )}
        </div>
      </div>
      <MoviesPagination page={page} totalPages={totalPages} query={query} />
    </div>
  )
}
