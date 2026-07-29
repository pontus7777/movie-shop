'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { removeFromWishlist } from '@/app/(public)/wishlist/_actions/wishlist-action'
import { addToCart } from '@/app/(public)/cart/_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import { isMovieOnSale } from '@/lib/pricing'
import Image from 'next/image'
import { Trash, ShoppingCart, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type WishlistItem = {
    movie: {
        id: string
        title: string
        imageUrl: string | null
        priceInCents: number
        saleStartsAt: Date | null
        saleEndsAt: Date | null
        salePriceInCents: number | null
    }
}

type Props = {
    items: WishlistItem[]
}

export function UserWishlist({ items }: Props) {

    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [pendingMovieId, setPendingMovieId] = useState<string | null>(null)


    function handleAddToCart(movieId: string) {
        setPendingMovieId(movieId)
        startTransition(async () => {
            await addToCart(movieId)
            toast.success('Added to cart')
            router.refresh()
            setPendingMovieId(null)
        })
    }

    function handleRemove(movieId: string) {
        setPendingMovieId(movieId)
        startTransition(async () => {
            await removeFromWishlist(movieId)
            toast.success('Removed from wishlist')
            router.refresh()
            setPendingMovieId(null)
        })
    }


    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                <Heart className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="font-medium text-foreground">Your wishlist is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                    Movies you save will appear here.
                </p>

                <Link
                    href="/movies"
                    className="text-sm font-medium text-red-400 hover:text-red-300 underline-offset-4 hover:underline"
                >
                    Browse movies
                </Link>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {items.map((item) => {
                const onSale = isMovieOnSale(item.movie)
                const isThisPending = pendingMovieId === item.movie.id

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
                                    {onSale && <Badge className="bg-red-600 text-white hover:bg-red-600">Sale</Badge>}
                                </div>

                                <p className="text-sm text-muted-foreground mb-4">
                                    €{convertToEuro(item.movie.priceInCents)}
                                </p>

                                <div className="mt-auto flex items-center gap-2">

                                    <Button
                                        size="sm"
                                        disabled={isThisPending}
                                        onClick={() => handleAddToCart(item.movie.id)}
                                    >
                                        <ShoppingCart className="mr-1 h-4 w-4" />
                                        Add to cart
                                    </Button>

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        disabled={isThisPending}
                                        onClick={() => handleRemove(item.movie.id)}
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>


                                    {/* <form action={async () => { await addToCart.bind(null, item.movie.id) }}>
                                        <Button size="sm" type="submit">
                                            <ShoppingCart className="mr-1 h-4 w-4" />
                                            Add to cart
                                        </Button>
                                    </form>

                                    <form action={async () => { await removeFromWishlist.bind(null, item.movie.id) }}>
                                        <Button size="icon" variant="ghost" type="submit">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </form> */}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}