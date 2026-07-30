import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

const isProd = process.env.NODE_ENV === 'production'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
})

const adapter = new PrismaPg(pool)

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  })

if (!isProd) {
  globalForPrisma.prisma = prisma
}

export default prisma
