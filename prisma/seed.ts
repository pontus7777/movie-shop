import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { CrewRole } from '@/generated/prisma/enums'
import { readFileSync } from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import { auth } from '@/lib/auth'

dotenv.config()

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
})

const PG_INT_MAX = 2147483647

function clampInt(value: number | null): number | null {
  if (value === null) return null
  return Math.min(value, PG_INT_MAX)
}

const CONCURRENCY = 10

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0

  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

interface SeedMovie {
  id: string
  title: string
  originalTitle: string | null
  description: string
  tagline: string | null
  priceInCents: number
  releaseYear: number
  releaseDate: string | null
  imageUrl: string | null
  backdropUrl: string | null
  trailerUrl: string | null
  imdbId: string | null
  stock: boolean
  runtime: number
  imdbRating: number | null
  popularity: number | null
  budget: number | null
  revenue: number | null
  genres: number[]
  credits: {
    id: string
    name: string
    role: 'ACTOR' | 'DIRECTOR'
  }[]
}

async function seed() {
  const filePath = path.join(__dirname, 'tmdb-data.json')
  const data = JSON.parse(readFileSync(filePath, 'utf8')) as {
    genres: { id: number; name: string }[]
    movies: SeedMovie[]
  }

  console.log('Resetting database')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.movie.deleteMany()
  await prisma.crew.deleteMany()
  await prisma.genre.deleteMany()
  await prisma.movieKeyword.deleteMany()

  console.log('Creating admin user...')
  try {
    await auth.api.createUser({
      body: {
        email: 'admin@admin.com',
        password: 'password',
        name: 'admin',
        role: 'admin',
      },
    })
  } catch {
    console.log('Admin user already exists, skipping.')
  }

  console.log('Seeding genres...')
  await prisma.genre.createMany({
    data: data.genres.map((g) => ({
      id: g.id,
      name: g.name,
      description: `${g.name} movies`,
    })),
    skipDuplicates: true,
  })

  console.log('Seeding crew...')
  const crewMap = new Map<string, { id: string; name: string }>()
  for (const movie of data.movies) {
    for (const c of movie.credits) {
      crewMap.set(c.id, { id: c.id, name: c.name })
    }
  }
  await prisma.crew.createMany({
    data: [...crewMap.values()],
    skipDuplicates: true,
  })

  console.log('Seeding movies...')
  let completed = 0
  await mapWithConcurrency(data.movies, CONCURRENCY, async (m) => {
    await prisma.movie.create({
      data: {
        id: m.id,
        title: m.title,
        originalTitle: m.originalTitle,
        description: m.description,
        tagline: m.tagline,
        priceInCents: m.priceInCents,
        releaseYear: m.releaseYear,
        releaseDate: m.releaseDate ? new Date(m.releaseDate) : null,
        imageUrl: m.imageUrl,
        backdropUrl: m.backdropUrl,
        trailerUrl: m.trailerUrl,
        imdbId: m.imdbId,
        stock: m.stock,
        runtime: m.runtime,
        imdbRating: m.imdbRating,
        popularity: m.popularity,
        budget: clampInt(m.budget),
        revenue: clampInt(m.revenue),

        genres: {
          connect: m.genres.map((id) => ({ id })),
        },

        credits: {
          create: m.credits.map((c) => ({
            crewId: c.id,
            role: c.role as CrewRole,
          })),
        },
      },
    })

    completed++
    if (completed % 100 === 0 || completed === data.movies.length) {
      console.log(`  ${completed}/${data.movies.length} movies seeded`)
    }
  })

  console.log('Seed complete!')
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
