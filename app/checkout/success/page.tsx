import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { fulfillOrder } from '@/lib/fulfill-order'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session-validation'
import { stripe } from '@/lib/stripe'
import { CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface Props {
  searchParams: Promise<{
    orderId?: string
  }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const authSession = await requireAuth()

  const { orderId } = await searchParams

  if (!orderId) {
    notFound()
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, userId: true, status: true, stripeSessionId: true },
  })

  // Not yours is treated the same as not found, so this page can't be used to
  // probe which order ids exist.
  if (!order || order.userId !== authSession.user.id) {
    notFound()
  }

  let status = order.status

  // This redirect and Stripe's webhook race each other. If the webhook hasn't
  // landed yet, fulfil here instead of showing the customer a pending order.
  if (status === 'PENDING' && order.stripeSessionId) {
    await fulfillOrder(await stripe.checkout.sessions.retrieve(order.stripeSessionId))

    const refreshed = await prisma.order.findUniqueOrThrow({
      where: { id: order.id },
      select: { status: true },
    })

    status = refreshed.status
  }

  const isPaid = status === 'PAID'

  return (
    <Card className="mx-auto mt-16 max-w-xl">
      <CardHeader className="text-center">
        {isPaid ? (
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
        ) : (
          <Clock className="mx-auto h-12 w-12 text-amber-600" />
        )}

        <CardTitle className={isPaid ? 'text-3xl text-green-600' : 'text-3xl text-amber-600'}>
          {isPaid ? 'Payment Successful' : 'Confirming your payment'}
        </CardTitle>

        <CardDescription>
          {isPaid
            ? 'Thank you for your purchase.'
            : 'This usually takes a few seconds. Refresh the page shortly.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground">Order ID</p>
        <p className="font-medium">
          <Badge
            className={
              isPaid
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
            }
          >
            {order.id}
          </Badge>
        </p>
      </CardContent>

      <Button asChild>
        <Link href="/movies">Continue shopping</Link>
      </Button>
    </Card>
  )
}
