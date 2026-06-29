import { Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { DeleteMovieBtn } from './_components/delete-movie-btn'
import { getMovieImageSrc } from '@/lib/image-utils'

export default async function MovieDetailsPage({ params }: PageProps<'/admin/movies/[id]'>) {
  // const params = await props.params

  if (!(await params).id) {
    notFound()
  }

  const movie = await prisma.movie.findUnique({
    where: {
      id: (await params).id,
    },
    include: {
      genres: true,
      credits: {
        include: {
          crew: true,
        },
      },
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
          <p className="text-muted-foreground">
            {movie.genres.length ? movie.genres.map((g) => g.name).join(', ') : 'No genre'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/admin/movies/${movie.id}/edit`}>
              <Edit />
              Edit
            </Link>
          </Button>

          <DeleteMovieBtn
            action={async () => {
              'use server'

              await prisma.movie.delete({
                where: {
                  id: movie.id,
                },
              })
            }}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Image
          src={getMovieImageSrc(movie.imageUrl)}
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
            <p>
              Genre:
              {movie.genres.length ? movie.genres.map((g) => g.name).join(', ') : 'No genre'}
            </p>
            {/* <p>Actors: {movie.crewMembers.map((ca) => ca.name).join(', ') || 'No actors'}</p>
            <p>Directors: {movie.crewMembers.map((cd) => cd.name).join(', ') || 'No directors'}</p> */}
            <p>
              Crew:
              {movie?.credits?.length
                ? movie.credits.map((c) => `${c.crew.name} (${c.role})`).join(', ')
                : 'No crew'}
            </p>

            {/* <p>
              Directors:
              {movie
                ? movie.credits.map((director) => director.crew.name).join(', ')
                : 'No directors'}
            </p> */}
          </div>
        </div>
      </div>
    </div>
  )
}
