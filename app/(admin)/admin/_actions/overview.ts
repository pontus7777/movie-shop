import 'server-only'
import prisma from '@/lib/prisma'

export async function getTotalUsers() {
  return prisma.user.count()
}

export async function getTotalMovies() {
  return prisma.movie.count()
}

export async function getTotalOrders() {
  return prisma.order.count()
}

export async function getTotalRevenue() {
  const result = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
    where: {
      status: 'PAID',
    },
  })

  // total is stored in cents
  return (result._sum.total ?? 0) / 100
}

export async function getMonthlyRevenue() {
  const orders = await prisma.order.findMany({
    where: {
      status: 'PAID',
    },
    select: {
      total: true,
      createdAt: true,
    },
  })

  const months = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(0, index).toLocaleString('default', {
      month: 'short',
    }),
    revenue: 0,
  }))

  orders.forEach((order) => {
    const month = order.createdAt.getMonth()

    months[month].revenue += order.total / 100
  })

  return months
}

export async function getUserRegistrations() {
  const users = await prisma.user.findMany({
    select: {
      createdAt: true,
    },
  })

  const months = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(0, index).toLocaleString('default', {
      month: 'short',
    }),
    users: 0,
  }))

  users.forEach((user) => {
    const month = user.createdAt.getMonth()

    months[month].users += 1
  })

  return months
}

export async function getMovieCategories() {
  const genres = await prisma.genre.findMany({
    select: {
      name: true,
      _count: {
        select: {
          movies: true,
        },
      },
    },
  })

  return genres
    .map((genre) => ({
      name: genre.name,
      count: genre._count.movies,
    }))
    .filter((genre) => genre.count > 0)
}
