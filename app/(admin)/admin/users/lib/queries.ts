// lib/dashboard.ts

import prisma from '@/lib/prisma'

export async function getUsersDashboard() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [totalUsers, admins, verifiedUsers, newUsers, users] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        role: 'ADMIN'.toLowerCase(),
      },
    }),
    prisma.user.count({
      where: {
        emailVerified: true, // or { not: null } if it's a DateTime
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    }),
    prisma.user.findMany({
      include: {
        orders: true,
      },
    }),
  ])

  return {
    users,
    totalUsers,
    admins,
    verifiedUsers,
    newUsers,
  }
}
