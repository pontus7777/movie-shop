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

  // IMPORTANT:
  // Every selected genre must exist on the movie, and a selected director
  // filter and a selected actor filter must both hold — each needs its own
  // entry here rather than sharing a `credits` key, since a plain object
  // literal would let the second `credits` spread silently overwrite the first.
  const andConditions: Prisma.MovieWhereInput[] = [
    ...genreIds.map((id) => ({
      genres: {
        some: {
          id,
        },
      },
    })),

    ...(directorIds.length > 0
      ? [
          {
            credits: {
              some: {
                role: 'DIRECTOR' as const,
                crewId: {
                  in: directorIds,
                },
              },
            },
          },
        ]
      : []),

    ...(actorIds.length > 0
      ? [
          {
            credits: {
              some: {
                role: 'ACTOR' as const,
                crewId: {
                  in: actorIds,
                },
              },
            },
          },
        ]
      : []),
  ]

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

    ...(andConditions.length > 0 && { AND: andConditions }),
  }
}
