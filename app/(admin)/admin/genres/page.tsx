import prisma from '@/lib/prisma'
import { AdminGenresPageClient } from './_components/admin-genres-page-client'
import { requireAdmin } from '@/lib/session-validation'

export default async function AdminGenresPage() {
  await requireAdmin()
  const genres = await prisma.genre.findMany()

  return <AdminGenresPageClient genres={genres} />
}
