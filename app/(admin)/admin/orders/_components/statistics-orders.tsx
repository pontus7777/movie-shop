import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CircleDollarSign, Clock3, Package, Truck } from 'lucide-react'

export function StatisticsOrder() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Total Orders</CardTitle>
          <Package className="size-5 text-muted-foreground" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">1,254</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pending</CardTitle>
          <Clock3 className="size-5 text-yellow-500" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">32</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Delivered</CardTitle>
          <Truck className="size-5 text-green-500" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">1,180</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Revenue</CardTitle>
          <CircleDollarSign className="size-5 text-primary" />
        </CardHeader>

        <CardContent>
          <p className="text-3xl font-bold">$45,230</p>
        </CardContent>
      </Card>
    </div>
  )
}
