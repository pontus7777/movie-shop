import { Suspense } from 'react'

import { headers } from 'next/headers'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { getCart } from '@/lib/cart'
import { getWishlistedMovieIds } from '@/lib/wishlist'

import ShopMovieCard, { MovieWithRelations } from '../_components/shop-movie-card'

import { MoviesPagination } from './_components/movies-pagination'
import { MoviesSidebar } from './_components/movies-sidebar'

import { buildMovieWhere } from './_lib/movie-filters'
import { getArrayParam, getStringParam } from './_lib/movie-query-helpers'
import { movieInclude } from './_lib/movie-include'
import { getMovieSidebarData } from './_lib/get-movie-sidebar-data'

export default async function MoviesPage(props: PageProps<'/movies'>) {
  const params = await props.searchParams

  const pageSize = 18
  const page = Number(params.page) || 1
  const skip = (page - 1) * pageSize

  const filters = {
    q: getStringParam(params.q),
    genre: params.genre,
    director: params.director,
    actor: params.actor,

    yearFrom: getStringParam(params.yearFrom),
    yearTo: getStringParam(params.yearTo),

    runtimeMin: getStringParam(params.runtimeMin),
    runtimeMax: getStringParam(params.runtimeMax),
  }

  const where = buildMovieWhere(filters)

  const genreIds = getArrayParam(params.genre).map(Number)
  const directorIds = getArrayParam(params.director)
  const actorIds = getArrayParam(params.actor)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const [movies, total, sidebarData, cart, wishlistedIds] = await Promise.all([
    prisma.movie.findMany({
      where,

      orderBy: {
        popularity: 'desc',
      },

      skip,
      take: pageSize,

      include: movieInclude,
    }) as Promise<MovieWithRelations[]>,

    prisma.movie.count({
      where,
    }),

    getMovieSidebarData(where),

    getCart(),

    session ? getWishlistedMovieIds(session.user.id) : Promise.resolve(new Set<string>()),
  ])

  const { genres, directors, actors } = sidebarData

  const totalPages = Math.ceil(total / pageSize)

  const hasActiveFilters = Boolean(
    genreIds.length ||
    directorIds.length ||
    actorIds.length ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.runtimeMin ||
    filters.runtimeMax,
  )

  const cartMap = new Map(cart.items.map((item) => [item.movie.id, item.quantity]))

  return (
    <main className="min-h-lvh px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-350">
        <h1 className="mb-4 text-2xl font-bold">Movies</h1>

        {(filters.q || hasActiveFilters) && (
          <p className="mb-6 text-sm text-muted-foreground">
            {total} {total === 1 ? 'movie' : 'movies'} found
          </p>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <Suspense>
            <MoviesSidebar
              genres={genres}
              directors={directors}
              actors={actors}
              selectedGenres={genreIds}
              selectedDirectors={directorIds}
              selectedActors={actorIds}
              yearFrom={filters.yearFrom}
              yearTo={filters.yearTo}
              runtimeMin={filters.runtimeMin}
              runtimeMax={filters.runtimeMax}
            />
          </Suspense>

          <section className="min-w-0 flex-1">
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-5
                2xl:grid-cols-6
              "
            >
              {movies.length > 0 ? (
                movies.map((movie) => (
                  <ShopMovieCard
                    key={movie.id}
                    movie={movie}
                    quantity={cartMap.get(movie.id) ?? 0}
                    isWishlisted={wishlistedIds.has(movie.id)}
                  />
                ))
              ) : (
                <p className="col-span-full py-12 text-center text-muted-foreground">
                  No movies found.
                </p>
              )}
            </div>

            <MoviesPagination
              page={page}
              totalPages={totalPages}
              query={filters.q}
              genreIds={genreIds}
              directorIds={directorIds}
              actorIds={actorIds}
              yearFrom={filters.yearFrom}
              yearTo={filters.yearTo}
              runtimeMin={filters.runtimeMin}
              runtimeMax={filters.runtimeMax}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
