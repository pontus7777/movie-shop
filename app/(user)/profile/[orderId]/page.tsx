import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session-validation'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, CreditCard, MapPin, Calendar, Film } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PosterImage } from '@/app/(public)/_components/poster-image'
import { orderStatusStyles, formatOrderStatus } from '@/lib/order-status'

const paymentLabels: Record<string, string> = {
  CARD: 'Card',
  PAYPAL: 'PayPal',
  SWISH: 'Swish',
}

export default async function UserOrderDetailsPage(props: PageProps<'/profile/[orderId]'>) {
  const params = await props.params
  const session = await requireAuth()

  const order = await prisma.order.findFirst({
    where: { id: params.orderId, userId: session.user.id },
    include: { shippingAddress: true },
  })

  if (!order) {
    notFound()
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: params.orderId },
    include: { movie: true },
  })

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Profile
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              Order{' '}
              <span className="font-mono text-lg text-muted-foreground">
                #{order.id.slice(-8).toUpperCase()}
              </span>
            </h1>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${orderStatusStyles[order.status] ?? 'bg-muted text-muted-foreground'}`}
            >
              {formatOrderStatus(order.status)}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold text-primary">
            €{convertToEuro(order.total).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Film className="h-4 w-4" />
              Items
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-4">
            {orderItems.map((orderItem) => (
              <div key={orderItem.id} className="flex items-center gap-4">
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  <PosterImage
                    src={getMovieImageSrc(orderItem.movie.imageUrl)}
                    alt={orderItem.movie.title}
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{orderItem.movie.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty {orderItem.quantity} &middot; €{convertToEuro(orderItem.priceInCents).toFixed(2)}{' '}
                    each
                  </p>
                </div>

                <p className="shrink-0 font-medium">
                  €{convertToEuro(orderItem.priceInCents * orderItem.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>
                  {order.paymentMethod
                    ? (paymentLabels[order.paymentMethod] ?? order.paymentMethod)
                    : 'Awaiting payment'}
                </span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>€{convertToEuro(order.total).toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="text-sm">
              {order.shippingAddress ? (
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">No shipping address on file.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
