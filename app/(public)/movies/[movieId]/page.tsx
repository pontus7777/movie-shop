import type { Metadata } from 'next'
import { getMovieImageSrc } from '@/lib/image-utils'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CartActionButton } from '@/components/cart-action-button'
import { getYoutubeEmbedUrl } from '@/lib/youtube-utils'
import { addToCart } from '../../cart/_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'
import { WishlistButton } from '../../wishlist/_components/wishlist-button'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { isMovieInWishlist } from '@/lib/wishlist'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'
import { ReviewSection } from './_components/review-section'
import { isMoviePurchased } from '@/lib/purchases'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export async function generateMetadata(
  props: PageProps<'/movies/[movieId]'>,
): Promise<Metadata> {
  const { movieId } = await props.params

  const movie = await prisma.movie.findUnique({
    where: { id: movieId },
    select: { title: true, description: true, imageUrl: true },
  })

  if (!movie) {
    return { title: 'Movie not found' }
  }

  const posterSrc = getMovieImageSrc(movie.imageUrl)

  return {
    title: movie.title,
    description: movie.description,
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [{ url: posterSrc }],
    },
  }
}

export default async function MovieDetailsPage(props: PageProps<'/movies/[movieId]'>) {
  const params = await props.params

  if (!params.movieId) {
    notFound()
  }

  const movie = await prisma.movie.findUnique({
    where: { id: params.movieId },
    include: {
      genres: true,
      credits: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!movie) {
    notFound()
  }

  const actors = await prisma.crew.findMany({
    where: {
      id: {
        in: movie.credits.filter((c) => c.role === 'ACTOR').map((c) => c.crewId),
      },
    },
  })

  const directors = await prisma.crew.findMany({
    where: {
      id: {
        in: movie.credits.filter((c) => c.role === 'DIRECTOR').map((c) => c.crewId),
      },
    },
  })

  const onSale = isMovieOnSale(movie)
  // const displayPrice = convertToEuro(movie.priceInCents)
  const effectivePrice = getEffectivePriceInCents(movie)
  const displayPrice = convertToEuro(effectivePrice)
  const originalPrice = convertToEuro(movie.priceInCents)
  const posterSrc = getMovieImageSrc(movie.imageUrl)
  const trailerEmbedUrl = getYoutubeEmbedUrl(movie.trailerUrl)

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const isWishlisted = session ? await isMovieInWishlist(session.user.id, movie.id) : false
  const hasPurchased = session ? await isMoviePurchased(session.user.id, movie.id) : false

  const userReview = session
    ? await prisma.review.findUnique({
      where: {
        userId_movieId: {
          userId: session.user.id,
          movieId: movie.id,
        },
      },
      select: {
        rating: true,
        comment: true,
      },
    })
    : null

  return (
    <div>
      {/* ===== HERO ===== */}
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
          <div className="relative h-90 w-full overflow-hidden">
            <Image
              src={posterSrc}
              alt=""
              fill
              sizes="100vw"
              className="scale-110 object-cover opacity-40 blur-2xl"
              priority
            />
          </div>
        )}

        <div className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent" />
      </div>

      {/* ===== INFO ===== */}
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="-mt-16 flex flex-col gap-6 sm:flex-row sm:items-end">
          <div className="mx-auto w-35 shrink-0 overflow-hidden rounded-xl shadow-2xl ring-1 shadow-black/50 ring-white/10 sm:mx-0 sm:w-47.5">
            <Image
              src={posterSrc}
              alt={movie.title}
              width={190}
              height={285}
              className="h-full w-full object-cover"
              priority
            />
            {onSale && (
              <div className="absolute top-2 left-2 rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
                SALE
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:pb-1 sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{movie.title}</h1>

            <p className="text-muted-foreground mt-1 text-sm">
              {movie.releaseYear} &middot; {movie.runtime > 0 ? `${movie.runtime} min` : 'TBA'}
              {directors.length > 0 && (
                <>
                  {' '}
                  &middot; Directed by{' '}
                  <span className="text-foreground">{directors.map((d) => d.name).join(', ')}</span>
                </>
              )}
            </p>
          </div>

          {movie.imdbRating != null && movie.imdbRating > 0 && (
            <div className="mx-auto flex shrink-0 flex-col items-center sm:mx-0 sm:pb-1">
              <div className="flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary text-base font-bold text-white">
                {movie.imdbRating.toFixed(1)}
              </div>

              <span className="text-muted-foreground mt-1 text-[10px] tracking-wide uppercase">
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
                className="border-primary bg-primary text-white"
              >
                {genre.name}
              </Badge>
            ))}

            {!movie.stock && <Badge variant="destructive">Out of stock</Badge>}
          </div>

          <p className="text-foreground/90 text-center leading-relaxed sm:text-left">
            {movie.description}
          </p>

          {actors.length > 0 && (
            <p className="text-muted-foreground text-center text-sm sm:text-left">
              <span className="text-foreground font-medium">Cast: </span>
              {actors.map((a) => a.name).join(', ')}
            </p>
          )}

          <Separator className="my-2" />

          <div className="mx-auto flex w-fit items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3 sm:mx-0">
            {!hasPurchased && (
              // <span className="text-1.5xl font-bold text-primary">€{displayPrice}</span> ???????????????????????????????????????????????????
              <div className="flex items-center gap-2">
                {onSale ? (
                  <>
                    <span className="text-muted-foreground text-lg line-through">
                      €{originalPrice}
                    </span>

                    <span className="text-2xl font-bold text-red-600">
                      €{displayPrice}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-primary">
                    €{displayPrice}
                  </span>
                )}
              </div>
            )}

            {hasPurchased ? (
              <Button
                asChild
                size="lg"
                className="bg-primary px-4 text-white hover:bg-primary"
              >
                <Link href={`/profile?tab=library&play=${movie.id}`}>Watch Now</Link>
              </Button>
            ) : (
              <CartActionButton
                movieId={movie.id}
                action={addToCart}
                cartChange={1}
                toastMessage="Added to cart!"
                disabled={!movie.stock}
                size="lg"
                className="bg-primary px-4 text-white hover:bg-primary"
              >
                {movie.stock ? 'Add to cart' : 'Out of stock'}
              </CartActionButton>
            )}

            <WishlistButton
              movieId={movie.id}
              initialIsWishlisted={isWishlisted}
              size="lg"
              variant="outline"
            />
          </div>

          {!hasPurchased && onSale && movie.saleEndsAt && (
            <p className="text-muted-foreground text-center text-xs sm:text-left">
              Sale ends {movie.saleEndsAt.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <ReviewSection
        reviews={movie.reviews}
        movieId={movie.id}
        userRating={movie.userRating}
        userReviewCount={movie.userReviewCount}
        userReview={userReview}
      />

      <div className="pb-16" />
    </div>
  )
}
