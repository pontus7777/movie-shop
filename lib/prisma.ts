import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as {
  prisma?: PrismaClient
}

console.log('NODE_ENV:', process.env.NODE_ENV)

console.log('DATABASE HOST:', process.env.DATABASE_URL?.split('@')[1]?.split('/')[0])

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
