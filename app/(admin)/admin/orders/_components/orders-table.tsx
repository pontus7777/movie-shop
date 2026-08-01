import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderActions } from './order-actions-component'
import { OrdersWithRelations } from '../_types/order'

type Props = {
  orders: OrdersWithRelations[]
  totalOrders: number
  currentPage: number
  totalPages: number
  searchParams?: string
}

export function OrdersTable({
  orders,
  totalOrders,
  currentPage,
  totalPages,
  searchParams = '',
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
        <CardDescription>
          Showing {orders.length} of {totalOrders} orders
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Payment</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell> {order.id.slice(0, 8)}</TableCell>

                  <TableCell>{order.user.name}</TableCell>

                  <TableCell> ${(order.total / 100).toFixed(2)}</TableCell>

                  <TableCell>
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      {order.status}
                    </span>
                  </TableCell>

                  <TableCell className="hidden md:table-cell">{order.paymentMethod}</TableCell>

                  <TableCell className="hidden lg:table-cell"> {new Date(order.createdAt).toLocaleDateString('SE-sv')}</TableCell>

                  <TableCell className="text-right">
                    <OrderActions order={order} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? `?${searchParams}&page=${currentPage - 1}` : '#'}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href={`?${searchParams}&page=${index + 1}`}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext href={currentPage < totalPages ? `?${searchParams}&page=${currentPage + 1}` : '#'} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
