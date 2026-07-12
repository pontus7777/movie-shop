import { Order, Prisma } from '@/generated/prisma/client'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        movie: true
      }
    }
  }
}>

type Props = {
  orders: OrderWithItems[]
}

export function UserOrderList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div>
        <h1>You have no order history!</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>Order List</h1>
      {orders.map((order) => (
        <div key={order.id} className="border rounded p-4 space-y-2">
          <div className="flex justify-between">
            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
            <p className="text-sm text-muted-foreground">{order.status}</p>
          </div>
          <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>

          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.movie.title} × {item.quantity}
                </span>
                <span>{(item.priceInCents / 100).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <p className="font-semibold">Total: {(order.total / 100).toFixed(2)}</p>
        </div>
      ))}
    </div>
  )
}
