import { convertToEuro } from '@/lib/priceUtils'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/session-validation'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export default async function UserOrderDetailsPage(props: PageProps<'/profile/[orderId]'>) {
  const params = await props.params
  const session = await requireAuth()

  const order = await prisma.order.findFirst({
    where: { id: params.orderId, userId: session.user.id },
  })

  if (!order) {
    notFound()
  }

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: params.orderId },
    include: { movie: true },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Order details # {params.orderId}</h1>

      <div className="space-y-4">
        {orderItems.map((orderItem) => (
          <div key={orderItem.id} className="rounded-md border p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{orderItem.movie.title}</h2>
            {orderItem.movie.imageUrl && (
              <Image src={orderItem.movie.imageUrl} alt="alt text" width={150} height={200} />
            )}

            <p>Quantity: {orderItem.quantity}</p>
            <p>Price: {convertToEuro(orderItem.priceInCents)}€</p>
          </div>
        ))}
      </div>
    </div>
  )
}
