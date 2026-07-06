import prisma from '@/lib/prisma'

export default async function UserOrderDetailsPage(props: PageProps<'/user/[orderId]'>) {
  const params = await props.params

  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: params.orderId },
    include: { movie: true },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Details Page</h1>

      <div className="space-y-4">
        {orderItems.map((orderItem) => (
          <div key={orderItem.id} className="rounded-md border p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{orderItem.movie.title}</h2>

            <p>Quantity: {orderItem.quantity}</p>
            <p>Price: {orderItem.priceInCents.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
