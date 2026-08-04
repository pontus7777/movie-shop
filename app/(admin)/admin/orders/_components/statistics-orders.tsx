import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Euro, Clock3, Package, Truck } from 'lucide-react'

type Props = {
  totalOrders: number
  pendingOrders: number
  paidOrders: number
  revenue: number
}

export function StatisticsOrder({ totalOrders, pendingOrders, paidOrders, revenue }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total Orders</CardTitle>
          <Package className="size-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold"> {totalOrders}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending</CardTitle>
          <Clock3 className="size-5 text-yellow-500" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">{pendingOrders}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Paid Orders</CardTitle>
          <Truck className="size-5 text-green-500" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">{paidOrders}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue</CardTitle>
          <Euro className="size-5 text-primary" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">€{(revenue / 100).toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
