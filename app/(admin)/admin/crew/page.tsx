import prisma from '@/lib/prisma'
// import { CrewTable } from './_components/crew-table'

export default async function AdminCrewPage() {
  const actors = await prisma.actor.findMany({
    include: {
      movies: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  const movies = await prisma.movie.findMany({
    orderBy: {
      title: 'asc',
    },
  })

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Crew</h2>
          <p className="text-muted-foreground">Manage actors and their movies</p>
        </div>
      </div>
      {/* <CrewTable actors={actors} movies={movies} /> */}
    </div>
  )
}
