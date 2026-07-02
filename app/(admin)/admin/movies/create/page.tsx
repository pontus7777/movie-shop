import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma'
import { CreateMovieForm } from './_components/create-movie-form'

export async function getCrewAndGenres() {
  return Promise.all([
    prisma.crew.findMany({ orderBy: { name: 'asc' } }),
    prisma.genre.findMany({ orderBy: { name: 'asc' } }),
  ])
}

export default async function CreateMoviePage() {
  const [crewMembers, genres] = await getCrewAndGenres()

  return (
    <div className="mx-auto mt-10 flex w-full justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Movie</CardTitle>
          <CardDescription>Add a new movie </CardDescription>
        </CardHeader>

        <CardContent>
          <CreateMovieForm crewMembers={crewMembers} genres={genres} />
        </CardContent>
      </Card>
    </div>
  )
}
