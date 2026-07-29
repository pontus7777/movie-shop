import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDatabaseWishlist } from '@/lib/wishlist'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'
import Image from 'next/image'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ShareWishlistButton } from './_components/share-wishlist-button'
import { getPurchasedMovieIds } from '@/lib/order'
import { getCart } from '@/lib/cart'
import { MovieCartButton } from '../_components/movie-cart-button'

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/sign-in')
  }

  const wishlist = await getDatabaseWishlist(session.user.id)
  const items = wishlist?.items ?? []

  const cart = await getCart()

  const cartQuantities = new Map(
    cart.items.map((item) => [item.movie.id, item.quantity])
  )

  const movieIds = items.map((item) => item.movie.id)
  const purchasedIds = await getPurchasedMovieIds(session.user.id, movieIds)

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Your wishlist is empty.</p>
      </div>
    )
  }

  return (
    <>
      <ShareWishlistButton
        initialIsPublic={wishlist?.isPublic ?? false}
        initialShareId={wishlist?.shareId ?? null}
      />

      <div className="m-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const onSale = isMovieOnSale(item.movie)
          const effectivePrice = getEffectivePriceInCents(item.movie)
          const purchased = purchasedIds.has(item.movie.id)
          const quantity = cartQuantities.get(item.movie.id) ?? 0

          return (
            <Card key={item.movie.id} className="overflow-hidden">
              <CardContent className="flex h-full gap-4 p-4">
                <div className="relative shrink-0">
                  <Image
                    src={getMovieImageSrc(item.movie.imageUrl)}
                    alt={item.movie.title}
                    width={90}
                    height={130}
                    className="rounded-md object-cover"
                  />

                  {onSale && (
                    <div className="absolute top-1 left-1 rounded-md bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      SALE
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h3 className="line-clamp-2 text-lg font-semibold">
                        {item.movie.title}
                      </h3>

                      {onSale && (
                        <Badge className="bg-red-600 text-white hover:bg-red-600">
                          Sale
                        </Badge>
                      )}

                      {purchased && (
                        <Badge className="bg-amber-500 text-white hover:bg-amber-500">
                          Purchased
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <p
                        className={
                          onSale
                            ? 'text-sm font-semibold text-red-600'
                            : 'text-sm text-muted-foreground'
                        }
                      >
                        €{convertToEuro(effectivePrice)}
                      </p>

                      {onSale && (
                        <p className="text-muted-foreground text-xs line-through">
                          €{convertToEuro(item.movie.priceInCents)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 w-36">
                    <MovieCartButton
                      movieId={item.movie.id}
                      initialQuantity={quantity}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}