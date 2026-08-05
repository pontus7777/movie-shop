import { Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'
import { DeleteMovieBtn } from './_components/delete-movie-btn'
import { deleteMovie } from '../_actions/delete-movie-action'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import { requireAdmin } from '@/lib/session-validation'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default async function MovieDetailsPage(props: PageProps<'/admin/movies/[id]'>) {
  await requireAdmin()
  const params = await props.params

  if (!params.id) {
    notFound()
  }

  const movie = await prisma.movie.findUnique({
    where: {
      id: params.id,
    },
    include: {
      genres: true,
      credits: {
        include: {
          crew: true,
        },
      },
      // keywords: true,
      orderItems: true,
      cartItems: true,
    },
  })

  if (!movie) {
    notFound()
  }

  const actors = movie.credits.filter((c) => c.role === 'ACTOR').map((c) => c.crew)

  const directors = movie.credits.filter((c) => c.role === 'DIRECTOR').map((c) => c.crew)

  const onSale = isMovieOnSale(movie)
  const effectivePrice = getEffectivePriceInCents(movie)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{movie.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {movie.genres.length ? (
              movie.genres.map((g) => (
                <Badge key={g.id} variant="secondary">
                  {g.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">No genre</span>
            )}
            {onSale && <Badge className="bg-red-600 text-white hover:bg-red-600">On Sale</Badge>}
            {!movie.stock && <Badge variant="destructive">Out of stock</Badge>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/admin/movies/${movie.id}/edit`}>
              <Edit />
              Edit
            </Link>
          </Button>

          <DeleteMovieBtn action={deleteMovie.bind(null, movie.id)} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <div className="relative w-fit">
            <Image
              src={getMovieImageSrc(movie.imageUrl)}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg object-cover shadow-sm"
              priority
            />
            {onSale && (
              <div className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                SALE
              </div>
            )}
          </div>

          <Card>
            <CardContent className="space-y-1 py-4">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl font-bold ${onSale ? 'text-red-600' : 'text-foreground'}`}
                >
                  €{convertToEuro(effectivePrice)}
                </span>
                {onSale && (
                  <span className="text-muted-foreground text-sm line-through">
                    €{convertToEuro(movie.priceInCents)}
                  </span>
                )}
              </div>
              {onSale && movie.saleEndsAt && (
                <p className="text-muted-foreground text-xs">
                  Sale ends {movie.saleEndsAt.toLocaleString()}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="py-5">
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">
                {movie.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="py-5">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Release year</dt>
                  <dd className="font-medium">{movie.releaseYear}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Runtime</dt>
                  <dd className="font-medium">{movie.runtime} minutes</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Stock</dt>
                  <dd className="font-medium">{movie.stock ? 'Available' : 'Out of stock'}</dd>
                </div>

                <div>
                  <dt className="text-muted-foreground">Genre</dt>
                  <dd className="font-medium">
                    {movie.genres.length ? movie.genres.map((g) => g.name).join(', ') : 'No genre'}
                  </dd>
                </div>

                <div className="col-span-2">
                  <Separator className="my-1" />
                </div>

                <div className="col-span-2">
                  <dt className="text-muted-foreground">Actors</dt>
                  <dd className="font-medium">
                    {actors.length ? actors.map((actor) => actor.name).join(', ') : 'No actors'}
                  </dd>
                </div>

                <div className="col-span-2">
                  <dt className="text-muted-foreground">Directors</dt>
                  <dd className="font-medium">
                    {directors.length
                      ? directors.map((director) => director.name).join(', ')
                      : 'No directors'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
