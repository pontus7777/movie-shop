import { Suspense } from 'react'

import prisma from '@/lib/prisma'

import ShopMovieCard, { MovieWithRelations } from '../_components/shop-movie-card'

import { MoviesPagination } from './_components/movies-pagination'
import { MoviesSidebar } from './_components/movies-sidebar'

import { getCart } from '@/lib/cart'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getWishlistedMovieIds } from '@/lib/wishlist'

export default async function MoviesPage(props: PageProps<'/movies'>) {
  const params = await props.searchParams

  const pageSize = 18

  const page = Number(params.page) || 1

  const query = typeof params.q === 'string' ? params.q.trim() : ''

  const genreIds = (
    Array.isArray(params.genre) ? params.genre : params.genre ? [params.genre] : []
  ).map(Number)

  const directorIds = Array.isArray(params.director)
    ? params.director
    : params.director
      ? [params.director]
      : []

  const actorIds = Array.isArray(params.actor) ? params.actor : params.actor ? [params.actor] : []

  const skip = (page - 1) * pageSize

  const where = {
    stock: true,

    ...(query && {
      title: {
        contains: query,
        mode: 'insensitive' as const,
      },
    }),

    ...(genreIds.length > 0 && {
      genres: {
        some: {
          id: {
            in: genreIds,
          },
        },
      },
    }),

    ...(directorIds.length > 0 && {
      credits: {
        some: {
          role: 'DIRECTOR' as const,
          crewId: {
            in: directorIds,
          },
        },
      },
    }),

    ...(actorIds.length > 0 && {
      credits: {
        some: {
          role: 'ACTOR' as const,
          crewId: {
            in: actorIds,
          },
        },
      },
    }),
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const [movies, total, genres, directors, actors, cart, wishlistedIds] = await Promise.all([
    prisma.movie.findMany({
      where,
      orderBy: {
        popularity: 'desc',
      },
      skip,
      take: pageSize,
      include: {
        genres: true,
        keywords: true,
        credits: {
          include: {
            crew: true,
          },
        },
      },
    }) as Promise<MovieWithRelations[]>,

    prisma.movie.count({
      where,
    }),

    prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    }),

    prisma.crew.findMany({
      where: {
        credits: {
          some: {
            role: 'DIRECTOR',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),

    prisma.crew.findMany({
      where: {
        credits: {
          some: {
            role: 'ACTOR',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    }),

    getCart(),

    session ? getWishlistedMovieIds(session.user.id) : Promise.resolve(new Set<string>()),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const hasActiveFilters = genreIds.length > 0 || directorIds.length > 0 || actorIds.length > 0

  return (
    <main className="min-h-lvh px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-350">
        <h1 className="mb-4 text-2xl font-bold">Movies</h1>

        {(query || hasActiveFilters) && (
          <p className="mb-6 text-sm text-muted-foreground">
            {query && (
              <>
                Results for{' '}
                <span className="font-medium text-foreground">&ldquo;{query}&rdquo;</span>
                {hasActiveFilters && ' with filters'}
                {' — '}
              </>
            )}
            {total} {total === 1 ? 'movie' : 'movies'} found
          </p>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <Suspense fallback={<div className="hidden w-64 shrink-0 lg:block" />}>
            <MoviesSidebar
              genres={genres}
              directors={directors}
              actors={actors}
              selectedGenres={genreIds}
              selectedDirectors={directorIds}
              selectedActors={actorIds}
            />
          </Suspense>

          <section className="min-w-0 flex-1 space-y-8">
            <div
              className="
                grid
                grid-cols-2
                gap-3
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-4
                xl:grid-cols-5
                2xl:grid-cols-6
              "
            >
              {movies.length > 0 ? (
                movies.map((movie) => {
                  const cartItem = cart.items.find((item) => item.movie.id === movie.id)

                  return (
                    <ShopMovieCard
                      key={movie.id}
                      movie={movie}
                      quantity={cartItem?.quantity ?? 0}
                      isWishlisted={wishlistedIds.has(movie.id)}
                    />
                  )
                })
              ) : (
                <p className="col-span-full py-12 text-center text-muted-foreground">
                  No movies found. Try adjusting your filters.
                </p>
              )}
            </div>

            <MoviesPagination
              page={page}
              totalPages={totalPages}
              query={query}
              genreIds={genreIds}
              directorIds={directorIds}
              actorIds={actorIds}
            />
          </section>
        </div>
      </div>
    </main>
  )
}
