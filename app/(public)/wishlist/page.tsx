import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getDatabaseWishlist } from '@/lib/wishlist'
import { removeFromWishlist } from './_actions/wishlist-action'
import { addToCart } from '@/app/(public)/cart/_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'
import Image from 'next/image'
import { Trash, ShoppingCart } from 'lucide-react'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ShareWishlistButton } from './_components/share-wishlist-button'

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect('/sign-in')
  }

  const wishlist = await getDatabaseWishlist(session.user.id)
  const items = wishlist?.items ?? []

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

          return (
            <Card key={item.movie.id}>
              <CardContent className="flex gap-4 p-4">
                <div className="relative w-fit">
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

                <div className="flex flex-1 flex-col">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-semibold">{item.movie.title}</h3>
                    {onSale && (
                      <Badge className="bg-red-600 text-white hover:bg-red-600">Sale</Badge>
                    )}
                  </div>

                  <div className="mb-4 flex items-baseline gap-2">
                    <p
                      className={`text-sm ${onSale ? 'font-semibold text-red-600' : 'text-muted-foreground'}`}
                    >
                      €{convertToEuro(effectivePrice)}
                    </p>
                    {onSale && (
                      <p className="text-muted-foreground text-xs line-through">
                        €{convertToEuro(item.movie.priceInCents)}
                      </p>
                    )}
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <form
                      action={async () => {
                        'use server'
                        await addToCart(item.movie.id)
                      }}
                    >
                      <Button size="sm" type="submit">
                        <ShoppingCart className="mr-1 h-4 w-4" />
                        Add to cart
                      </Button>
                    </form>

                    <form
                      action={async () => {
                        'use server'
                        await removeFromWishlist(item.movie.id)
                      }}
                    >
                      <Button size="icon" variant="ghost" type="submit">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </form>
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
