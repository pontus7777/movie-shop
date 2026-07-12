import { Order, Prisma } from '@/generated/prisma/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        movie: true
      }
    }
    shippingAddress: true
  }
}>

type Props = {
  orders: OrderWithItems[]
}
const statusVariant = {
  PENDING: 'secondary',
  PAID: 'default',
  CANCELLED: 'destructive',
} as const

export function UserOrderList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div>
        <h1>You have no order history!</h1>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Order #{order.id.slice(0, 8)}</CardTitle>
              <CardDescription>{order.createdAt.toLocaleDateString()}</CardDescription>
            </div>
            <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Items */}
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

            {/* Shipping address */}
            {order.shippingAddress && (
              <>
                <Separator />
                <div className="text-sm text-muted-foreground">
                  <p className="mb-1 font-medium text-foreground">Shipping Address</p>
                  <p>
                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                  </p>
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.postalCode} {order.shippingAddress.city}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="justify-end border-t pt-4">
            <p className="font-semibold">Total: {(order.total / 100).toFixed(2)}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
