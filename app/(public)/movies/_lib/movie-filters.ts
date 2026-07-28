import { Prisma } from '@/generated/prisma/client'

type MovieFilterParams = {
  q?: string
  genre?: string | string[]
  director?: string | string[]
  actor?: string | string[]
  yearFrom?: string
  yearTo?: string
  runtimeMin?: string
  runtimeMax?: string
}

export function buildMovieWhere(params: MovieFilterParams): Prisma.MovieWhereInput {
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

  const yearFrom = params.yearFrom ? Number(params.yearFrom) : undefined
  const yearTo = params.yearTo ? Number(params.yearTo) : undefined

  const runtimeMin = params.runtimeMin ? Number(params.runtimeMin) : undefined
  const runtimeMax = params.runtimeMax ? Number(params.runtimeMax) : undefined

  return {
    stock: true,

    ...(query && {
      title: {
        contains: query,
        mode: 'insensitive',
      },
    }),

    ...(yearFrom || yearTo
      ? {
          releaseYear: {
            ...(yearFrom && {
              gte: yearFrom,
            }),
            ...(yearTo && {
              lte: yearTo,
            }),
          },
        }
      : {}),

    ...(runtimeMin || runtimeMax
      ? {
          runtime: {
            ...(runtimeMin && {
              gte: runtimeMin,
            }),
            ...(runtimeMax && {
              lte: runtimeMax,
            }),
          },
        }
      : {}),

    // IMPORTANT:
    // Every selected genre must exist on the movie
    ...(genreIds.length > 0 && {
      AND: genreIds.map((id) => ({
        genres: {
          some: {
            id,
          },
        },
      })),
    }),

    ...(directorIds.length > 0 && {
      credits: {
        some: {
          role: 'DIRECTOR',
          crewId: {
            in: directorIds,
          },
        },
      },
    }),

    ...(actorIds.length > 0 && {
      credits: {
        some: {
          role: 'ACTOR',
          crewId: {
            in: actorIds,
          },
        },
      },
    }),
  }
}
