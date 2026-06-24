import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditMovieForm } from './_components/movie-edit-form'

// changed page props from /admin/movies/[id]/edit
export default async function EditMoviePage(props: PageProps<'/admin/movies/[id]'>) {
  const params = await props.params

  const movie = await prisma.movie.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!movie) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-prose space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Edit Movie</h1>
        <p className="text-muted-foreground">{movie.title}</p>
      </div>

      <EditMovieForm
        movie={{
          ...movie,
        }}
      />
    </div>
  )
}
