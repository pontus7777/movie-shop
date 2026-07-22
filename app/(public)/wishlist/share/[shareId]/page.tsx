import { getPublicWishlistByShareId } from '@/lib/wishlist'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function PublicWishlistPage(props: PageProps<'/wishlist/share/[shareId]'>) {
  const params = await props.params
  const wishlist = await getPublicWishlistByShareId(params.shareId)

  if (!wishlist) {
    notFound()
  }

  return (
    <div className="m-5">
      <h1 className="mb-6 text-2xl font-bold">
        {wishlist.user.name ? `${wishlist.user.name}'s Wishlist` : 'Shared Wishlist'}
      </h1>

      {wishlist.items.length === 0 ? (
        <p className="text-muted-foreground">This wishlist is empty.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.items.map((item) => (
            <Card key={item.movie.id}>
              <CardContent className="flex gap-4 p-4">
                <Image
                  src={getMovieImageSrc(item.movie.imageUrl)}
                  alt={item.movie.title}
                  width={90}
                  height={130}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold">{item.movie.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    €{convertToEuro(item.movie.priceInCents)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
