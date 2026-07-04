import prisma from '@/lib/prisma'

const PAGE_SIZE = 10

export async function getUsersDashboard(page = 1) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [totalUsers, admins, verifiedUsers, newUsers, users] = await Promise.all([
    //query1
    prisma.user.count(), //SELECT COUNT(*) FROM User;
    //query2
    prisma.user.count({
      where: {
        OR: [{ role: 'ADMIN' }, { role: 'admin' }], //SELECT COUNT(*) FROM User WHERE role = 'ADMIN' OR role = 'admin';
      },
    }),
    //query3
    prisma.user.count({
      //SELECT COUNT(*) FROM User WHERE emailVerified =true;
      where: {
        emailVerified: true,
      },
    }),
    //query4
    prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo, //createdAt >= thirtyDaysAgo
        },
      },
    }),
    //query5
    prisma.user.findMany({
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
    admins,
    verifiedUsers,
    newUsers,
    totalPages: Math.ceil(totalUsers / PAGE_SIZE),
    currentPage: page,
  }
}
