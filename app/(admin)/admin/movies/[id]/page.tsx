import { Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'

export default async function MovieDetailsPage(props: PageProps<'/admin/movies/[id]'>) {
  const params = await props.params

  if (!params.id) {
    notFound()
  }

  const movie = await prisma.movie.findUnique({
    where: {
      id: params.id,
    },
    include: {
      genre: true,
      actors: true,
      directors: true,
    },
  })

  if (!movie) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-muted-foreground">{movie.genre?.name ?? 'No genre'}</p>
        </div>

        <Button variant="secondary" asChild>
          <Link href={`/admin/movies/${movie.id}/edit`}>
            <Edit />
            Edit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Image
          src={movie.imageUrl ?? '/placeholder-movie.jpg'}
          alt={movie.title}
          width={300}
          height={450}
          className="rounded-lg object-cover"
          priority
        />

        <div className="space-y-4">
          <p className="whitespace-pre-line">{movie.description}</p>

          <div className="text-muted-foreground grid gap-2 text-sm font-medium">
            <p>Price: ${Number(movie.price).toFixed(2)}</p>
            <p>Release year: {movie.releaseYear}</p>
            <p>Runtime: {movie.runtime} minutes</p>
            <p>Stock: {movie.stock ? 'Available' : 'Out of stock'}</p>
            <p>Genre: {movie.genre?.name ?? 'No genre'}</p>
            <p>Actors: {movie.actors.map((actor) => actor.name).join(', ') || 'No actors'}</p>
            <p>
              Directors:{' '}
              {movie.directors.map((director) => director.name).join(', ') || 'No directors'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
