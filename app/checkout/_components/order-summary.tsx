import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export async function OrderSummary() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return null
  }

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

  const total = cart.items.reduce(
    (sum, item) => sum + item.quantity * convertToEuro(item.movie.priceInCents),
    0,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <Separator className="my-2" />
      <CardContent className="space-y-4">
        {cart.items.map((item) => (
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
                <p className="line-clamp-1 font-semibold">{item.movie.title}</p>
                <p className="text-muted-foreground text-sm">
                  {convertToEuro(item.movie.priceInCents)} € each
                </p>
              </div>
            </div>

            <p className="font-medium">
              {convertToEuro(item.movie.priceInCents) * item.quantity} €
            </p>
          </div>

          // <div key={item.id} className="flex items-center justify-between border-b pb-3">
          //   {/* <Image
          //     src={getMovieImageSrc(item.movie.imageUrl)}
          //     alt={item.movie.title}
          //     width={48}
          //     height={62}
          //     className="rounded-md object-cover"
          //   /> */}

          //   <Avatar className="h-14 w-14">
          //     <AvatarImage
          //       src={getMovieImageSrc(item.movie.imageUrl)}
          //       alt={item.movie.title}
          //       className="rounded-md object-cover"
          //     />
          //     <AvatarFallback> {item.movie.title.slice(0, 2).toUpperCase()}</AvatarFallback>
          //     <AvatarBadge className="bg-green-600 text-white dark:bg-green-800">
          //       {item.quantity}
          //     </AvatarBadge>
          //   </Avatar>

          //   <div>
          //     <p className="font-medium">{item.movie.title}</p>
          //     <p className="text-muted-foreground text-sm">Qty: {item.quantity}</p>
          //   </div>

          //   <p>{convertToEuro(item.movie.priceInCents) * item.quantity} €</p>
          // </div>
        ))}

        <div className="flex justify-between pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{convertToEuro(total)} €</span>
        </div>
      </CardContent>
    </Card>
  )
}
