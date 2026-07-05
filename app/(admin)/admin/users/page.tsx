import { UsersPageClient } from './_components/users-page-client'
import { getUserStats, getUsers } from './lib/queries'

type Props = {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
    status?: 'verified' | 'unverified'
  }>
}

export default async function UsersPage({ searchParams }: Props) {
  const { page, search, role, status } = await searchParams

  const currentPage = Number(page) || 1

  const [stats, usersData] = await Promise.all([
    getUserStats(),
    getUsers({
      page: currentPage,
      search,
      role,
      status,
    }),
  ])

  return <UsersPageClient stats={stats} usersData={usersData} />
}
