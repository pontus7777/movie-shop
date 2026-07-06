import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { UserFilters } from './types'

const PAGE_SIZE = 10

export async function getUserStats() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [totalUsers, admins, verifiedUsers, newUsers] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: {
          equals: 'admin',
          mode: 'insensitive',
        },
      },
    }),

    prisma.user.count({
      where: {
        emailVerified: true,
      },
    }),

    prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
  ])

  return {
    totalUsers,
    admins,
    verifiedUsers,
    newUsers,
  }
}

export async function getUsers({ page = 1, search, role, status }: UserFilters) {
  const where: Prisma.UserWhereInput = {}

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        email: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ]
  }

  if (role) {
    where.role = {
      equals: role,
      mode: 'insensitive',
    }
  }

  if (status === 'verified') {
    where.emailVerified = true
  }

  if (status === 'unverified') {
    where.emailVerified = false
  }

  const [totalUsers, users] = await Promise.all([
    prisma.user.count({
      where,
    }),

    prisma.user.findMany({
      where,
      include: {
        orders: true,
      },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      orderBy: {
        createdAt: 'desc',
      },
    }),
  ])

  return {
    users,
    totalUsers,
    totalPages: Math.ceil(totalUsers / PAGE_SIZE),
    currentPage: page,
  }
}
