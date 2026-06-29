import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { CreateMovieForm } from './_components/create-movie-form'
import prisma from '@/lib/prisma'

export default async function CreateMoviePage() {
  const [crew, genres] = await Promise.all([
    prisma.crew.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: [{ name: 'asc' }],
    }),
    prisma.genre.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
  ])
  return (
    <div className="mx-auto mt-10 flex w-full justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Movie</CardTitle>
          <CardDescription>Add a new movie </CardDescription>
        </CardHeader>

        <CardContent>
          <CreateMovieForm crew={crew} genres={genres} />
        </CardContent>
      </Card>
    </div>
  )
}
