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
  keywords: { id: number; name: string }[]
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
  for (const g of data.genres) {
    await prisma.genre.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        name: g.name,
        description: `${g.name} movies`,
      },
    })
  }

  console.log('Seeding keywords...')
  const keywordMap = new Map<number, string>()
  for (const movie of data.movies) {
    for (const k of movie.keywords) {
      if (!keywordMap.has(k.id)) {
        keywordMap.set(k.id, k.name)
        await prisma.movieKeyword.upsert({
          where: { id: k.id },
          update: {},
          create: {
            id: k.id,
            name: k.name,
          },
        })
      }
    }
  }

  console.log('Seeding crew...')
  const crewMap = new Map<string, { id: string; name: string }>()

  for (const movie of data.movies) {
    for (const c of movie.credits) {
      if (!crewMap.has(c.id)) {
        crewMap.set(c.id, c)
        await prisma.crew.upsert({
          where: { id: c.id },
          update: {},
          create: {
            id: c.id,
            name: c.name,
          },
        })
      }
    }
  }

  console.log('Seeding movies...')
  for (const m of data.movies) {
    await prisma.movie.upsert({
      where: { id: m.id },
      update: {},
      create: {
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
        budget: m.budget,
        revenue: m.revenue,

        genres: {
          connect: m.genres.map((id) => ({ id })),
        },

        keywords: {
          connect: m.keywords.map((k) => ({ id: k.id })),
        },

        credits: {
          create: m.credits.map((c) => ({
            crewId: c.id,
            role: c.role as CrewRole,
          })),
        },
      },
    })
  }

  console.log('Seed complete!')
}

seed()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
