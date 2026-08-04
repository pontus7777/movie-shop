import { Prisma } from '@/generated/prisma/client'
import Link from 'next/link'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import { orderStatusStyles, formatOrderStatus } from '@/lib/order-status'

type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: { movie: true }
    }
    shippingAddress: true
  }
}>

type Props = {
  orders: OrderWithItems[]
}

export function UserOrderList({ orders }: Props) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
        <ShoppingBag className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="font-medium text-foreground">No orders yet</p>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Your order history will appear here once you make a purchase.
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
    <div className="flex flex-col gap-2">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/profile/${order.id}`}
          className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3.5 transition-colors hover:bg-muted/40"
        >
          <div className="flex h-13 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Order{' '}
              <span className="font-mono text-xs text-muted-foreground">
                #{order.id.slice(-8).toUpperCase()}
              </span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}{' '}
              &middot; {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-sm font-semibold text-primary">
              €{(order.total / 100).toFixed(2)}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${orderStatusStyles[order.status] ?? 'bg-muted text-muted-foreground'}`}
            >
              {formatOrderStatus(order.status)}
            </span>
          </div>

          <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
        </Link>
      ))}
    </div>
  )
}
