import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import Link from 'next/link'
import { MovieTable } from './_components/movie-table'
import { MoviesSearch } from './_components/movies-search'
import { requireAdmin } from '@/lib/session-validation'
import AdminMovieCard from './_components/admin-movie-card'

const DEFAULT_PAGE_SIZE = 10
const ALLOWED_PAGE_SIZES = [10, 25, 50, 100]

const SORT_FIELDS = {
  title: 'title',
  releaseYear: 'releaseYear',
  price: 'priceInCents',
  rating: 'imdbRating',
} as const

export type MovieSortKey = keyof typeof SORT_FIELDS

function isSortKey(value: string | undefined): value is MovieSortKey {
  return !!value && value in SORT_FIELDS
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string
    pageSize?: string
    q?: string
    sort?: string
    order?: string
  }>
}) {
  const { page, pageSize, q, sort, order } = await searchParams
  const currentPage = Math.max(1, Number(page) || 1)
  const parsedPageSize = Number(pageSize)
  const currentPageSize = ALLOWED_PAGE_SIZES.includes(parsedPageSize)
    ? parsedPageSize
    : DEFAULT_PAGE_SIZE
  const search = q?.trim()

  const currentSort: MovieSortKey = isSortKey(sort) ? sort : 'title'
  const currentOrder: Prisma.SortOrder = order === 'desc' ? 'desc' : 'asc'

  await requireAdmin()

  const where: Prisma.MovieWhereInput = search
    ? { title: { contains: search, mode: 'insensitive' } }
    : {}

  const movies = await prisma.movie.findMany({
    where,
    include: {
      genres: true,
      // keywords: true,
      credits: {
        include: { crew: true },
      },
    },
    orderBy: {
      [SORT_FIELDS[currentSort]]: currentOrder,
    },
    skip: (currentPage - 1) * currentPageSize,
    take: currentPageSize,
  })

  const totalMovies = await prisma.movie.count({ where })

  const totalPages = Math.max(1, Math.ceil(totalMovies / currentPageSize))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Movies</h2>
          <p className="text-muted-foreground">Manage movies!</p>
        </div>

        <div className="flex items-center gap-3">
          <MoviesSearch />

          <Button asChild>
            <Link href="/admin/movies/create">Add Movie</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {movies.map((m) => (
          <AdminMovieCard key={m.id} movie={m} />
        ))}
      </div>
      <div className="hidden md:block">
        <MovieTable
          movies={movies}
          currentPage={currentPage}
          totalPages={totalPages}
          currentPageSize={currentPageSize}
          currentSort={currentSort}
          currentOrder={currentOrder}
        />
      </div>
    </div>
  )
}
