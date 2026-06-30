import { Order } from '@/generated/prisma/client'

type Props = {
  orders: Order[]
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
        <div key={order.id}>
          <p>{order.total.toString()}</p>
          <p>test</p>
        </div>
      ))}
    </div>
  )
}
