import { StatisticsOrder } from './_components/statistics-orders'
import { FiltersOrder } from './_components/filters-orders'
import { OrdersTable } from './_components/orders-table'
import { getOrders } from './_actions/get-orders-action'
import { getOrderStatistics } from './_actions/get-order-statistics-action'
import { requireAdmin } from '@/lib/session-validation'

type Props = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
    payment?: string
  }>
}

export default async function OrdersPage({ searchParams }: Props) {
  await requireAdmin()

  const params = await searchParams
  const { page, ...restParams } = params

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
        searchParams={new URLSearchParams(restParams as Record<string, string>).toString()}
      />
    </div>
  )
}
