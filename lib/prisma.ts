import { PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? true : { rejectUnauthorized: false },
})

const adapter = new PrismaPg(pool)

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
