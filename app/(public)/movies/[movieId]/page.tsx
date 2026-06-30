import { getMovieImageSrc } from '@/lib/image-utils'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CartActionButton } from '@/components/cart-action-button'
import { addToCart } from '@/app/cart/_actions/cart-actions'
import { getYoutubeEmbedUrl } from '@/lib/youtube-utils'

export default async function MovieDetailsPage(props: PageProps<'/movies/[movieId]'>) {
  const params = await props.params

  if (!params.movieId) {
    notFound()
  }

  const movie = await prisma.movie.findUnique({
    where: { id: params.movieId },
    include: { genres: true, crewMembers: true },
  })

  if (!movie) {
    notFound()
  }

  const actors = movie.crewMembers.filter((c) => c.role === 'ACTOR')
  const directors = movie.crewMembers.filter((c) => c.role === 'DIRECTOR')

  // price is stored in smallest unit (e.g. cents/öre) per schema comment
  const displayPrice = (movie.price / 100).toFixed(2)
  const posterSrc = getMovieImageSrc(movie.imageUrl)
  const trailerEmbedUrl = getYoutubeEmbedUrl(movie.trailerUrl)

  console.log('Trailer URL: ', trailerEmbedUrl)

  return (
    <div>
      {/* ===== HERO: trailer if available, else blurred poster banner ===== */}
      <div className="relative w-full bg-black">
        {trailerEmbedUrl ? (
          <div className="relative mx-auto aspect-video w-full max-w-6xl pb-30">
            <iframe
              src={trailerEmbedUrl}
              title={`${movie.title} trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : (
          <div className="relative h-[360px] w-full overflow-hidden">
            <Image
              src={posterSrc}
              alt=""
              fill
              className="scale-110 object-cover opacity-40 blur-2xl"
              priority
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* ===== FLOATING INFO CARD ===== */}
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="mx-auto w-[140px] shrink-0 overflow-hidden rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/10 sm:mx-0 sm:w-[190px]">
            <Image
              src={posterSrc}
              alt={movie.title}
              width={190}
              height={285}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="flex-1 text-center sm:pb-1 sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{movie.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {movie.releaseYear} &middot; {movie.runtime} min
              {directors.length > 0 && (
                <>
                  {' '}
                  &middot; Directed by{' '}
                  <span className="text-foreground">{directors.map((d) => d.name).join(', ')}</span>
                </>
              )}
            </p>
          </div>

          {movie.rating != null && (
            <div className="mx-auto flex shrink-0 flex-col items-center sm:mx-0 sm:pb-1">
              <div className="flex size-14 items-center justify-center rounded-full border-2 border-purple-500 bg-purple-950/40 text-base font-bold text-purple-300">
                {movie.rating.toFixed(1)}
              </div>
              <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                Rating
              </span>
            </div>
          )}
        </div>

        {/* ===== DETAILS ===== */}
        <div className="mx-auto mt-8 max-w-3xl space-y-5 sm:mx-0">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {movie.genres.map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="border-purple-500/20 bg-purple-950/40 text-purple-200"
              >
                {genre.name}
              </Badge>
            ))}
            {!movie.stock && <Badge variant="destructive">Out of stock</Badge>}
          </div>

          <p className="text-center leading-relaxed text-foreground/90 sm:text-left">
            {movie.description}
          </p>

          {actors.length > 0 && (
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              <span className="font-medium text-foreground">Cast: </span>
              {actors.map((a) => a.name).join(', ')}
            </p>
          )}

          <Separator className="my-2" />

          <div className="mx-auto flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:mx-0">
            <span className="text-1.5xl font-bold text-purple-400">€{displayPrice}</span>
            <CartActionButton
              movieId={movie.id}
              action={addToCart}
              toastMessage="Added to cart!"
              disabled={!movie.stock}
              size="lg"
              className="bg-purple-600 px-4 text-white hover:bg-purple-700"
            >
              {movie.stock ? 'Add to cart' : 'Out of stock'}
            </CartActionButton>
          </div>
        </div>
      </div>

      <div className="pb-16" />
    </div>
  )
}
