import { Button } from '@/components/ui/button'

import { StatisticsOrder } from './_components/statistics-orders'
import { FiltersOrder } from './_components/filters-orders'
import { OrdersTable } from './_components/orders-table'
import { getOrders } from './_actions/get-orders-action'
import { getOrderStatistics } from './_actions/get-order-statistics-action'

type Props = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    payment?: string
  }>
}

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams
  // const page = Number(params.page ?? 1)

  const [data, statistics] = await Promise.all([
    getOrders({
      page: Number(params.page ?? 1),
      search: params.search,
      status: params.status,
      payment: params.payment,
    }),
    getOrderStatistics(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>

        {/* <Button>Create Order</Button> */}
      </div>

      {/* Statistics */}
      <StatisticsOrder
        totalOrders={statistics.totalOrders}
        pendingOrders={statistics.pendingOrders}
        paidOrders={statistics.paidOrders}
        revenue={statistics.revenue}
      />

      {/* Filters */}
      <FiltersOrder />

      {/* Orders Table */}
      <OrdersTable
        orders={data.orders}
        totalOrders={data.total}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        searchParams={new URLSearchParams(params).toString()}
      />
    </div>
  )
}
