import prisma from '@/lib/prisma'
import { AdminCrewPageClient } from './_components/admin-crew-page-client'
import { requireAdmin } from '@/lib/session-validation'

export default async function AdminCrewPage() {
  await requireAdmin()
  const crew = await prisma.crew.findMany()

  return <AdminCrewPageClient crew={crew} />
}
