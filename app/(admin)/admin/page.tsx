import { requireAdmin } from '@/lib/session-validation'
import { BarChart3, DollarSign, Film, PieChart, ShoppingCart, Users } from 'lucide-react'

import {
  getMonthlyRevenue,
  getMovieCategories,
  getTotalMovies,
  getTotalOrders,
  getTotalRevenue,
  getTotalUsers,
  getUserRegistrations,
} from './_actions/overview'

import { DashboardCard } from './_components/dashboard-card'
import { StatCard } from './_components/stat-card'
import { MovieCategoryChart } from './_components/movie-category.chart'
import { RevenueChart } from './_components/revenue-chart'
import { UserRegistrationChart } from './_components/user-registration-chart'

export default async function AdminPage() {
  await requireAdmin()

  const statsPromise = Promise.all([
    getTotalUsers(),
    getTotalMovies(),
    getTotalOrders(),
    getTotalRevenue(),
  ])

  const chartsPromise = Promise.all([
    getMonthlyRevenue(),
    getUserRegistrations(),
    getMovieCategories(),
  ])

  const [
    [totalUsers, totalMovies, totalOrders, totalRevenue],
    [monthlyRevenue, userRegistrations, movieCategories],
  ] = await Promise.all([statsPromise, chartsPromise])

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: 'Movies',
      value: totalMovies.toLocaleString(),
      icon: Film,
    },
    {
      title: 'Orders',
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      title: 'Revenue',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(totalRevenue),
      icon: DollarSign,
      iconClassName: 'text-primary',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform&apos;s performance.</p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <DashboardCard title="Revenue Trend" icon={BarChart3} className="xl:col-span-2">
          <RevenueChart data={monthlyRevenue} />
        </DashboardCard>

        <DashboardCard title="User Registrations" icon={Users}>
          <UserRegistrationChart data={userRegistrations} />
        </DashboardCard>

        <DashboardCard title="Movie Categories" icon={PieChart}>
          <MovieCategoryChart data={movieCategories} />
        </DashboardCard>
      </section>
    </div>
  )
}
