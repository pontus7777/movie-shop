import prisma from '@/lib/prisma'
import { CrewTable } from './_components/crew-table'

export default async function AdminCrewPage() {

    const crew = await prisma.crew.findMany()


  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Crew</h2>
          <p className="text-muted-foreground">Manage crews and their movies</p>
        </div>
      </div>
      <CrewTable crewMembers={crew} />
    </div>
  )
}
