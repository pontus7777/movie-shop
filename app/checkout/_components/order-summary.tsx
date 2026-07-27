import prisma from '@/lib/prisma'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { requireAuth } from '@/lib/session-validation'
import { calculateCartTotals } from '@/lib/discount'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'

export async function OrderSummary() {
  const session = await requireAuth()

  const cart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
    },
    include: {
      items: {
        include: {
          movie: true,
        },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <p>Your cart is empty.</p>
        </CardContent>
      </Card>
    )
  }

  const { subtotal, discountPercentage, discountAmount, total } = await calculateCartTotals(
    cart.items,
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <CardTitle>Order Summary</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/cart">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-4 pt-4">
        {cart.items.map((item) => {
          const onSale = isMovieOnSale(item.movie)
          const effectivePrice = getEffectivePriceInCents(item.movie)

          return (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                  <AvatarImage
                    src={getMovieImageSrc(item.movie.imageUrl)}
                    alt={item.movie.title}
                    className="rounded-md object-cover"
                  />
                  <AvatarFallback>{item.movie.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                  <AvatarBadge className="bg-green-600 text-white dark:bg-green-800">
                    {item.quantity}
                  </AvatarBadge>
                </Avatar>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <p className="line-clamp-1 font-semibold">{item.movie.title}</p>
                    {onSale && (
                      <Badge className="bg-red-600 text-white hover:bg-red-600">Sale</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <p
                      className={`text-sm ${onSale ? 'font-medium text-red-600' : 'text-muted-foreground'}`}
                    >
                      {convertToEuro(effectivePrice)} € each
                    </p>
                    {onSale && (
                      <p className="text-muted-foreground text-xs line-through">
                        {convertToEuro(item.movie.priceInCents)} €
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <p className="font-medium">
                {(convertToEuro(effectivePrice) * item.quantity).toFixed(2)} €
              </p>
            </div>
          )
        })}

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>

        {discountPercentage > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Bulk discount ({discountPercentage}% off)</span>
            <span>-{discountAmount.toFixed(2)} €</span>
          </div>
        )}

        <Separator />

        <div className="flex justify-between pt-2 text-lg font-bold">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </CardContent>
    </Card>
  )
}