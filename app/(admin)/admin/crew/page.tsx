import prisma from '@/lib/prisma'
import { AdminCrewPageClient } from './_components/admin-crew-page-client'

export default async function AdminCrewPage() {
  const crew = await prisma.crew.findMany()

  return <AdminCrewPageClient crew={crew} />
}
