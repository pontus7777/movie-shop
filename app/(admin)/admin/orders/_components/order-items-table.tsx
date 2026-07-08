import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Props = {
  items: {
    id: string
    quantity: number
    priceInCents: number
    movie: {
      title: string
    }
  }[]
}

export function OrderItemsTable({ items }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Movie</TableHead>

          <TableHead>Quantity</TableHead>

          <TableHead>Price</TableHead>

          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.movie.title}</TableCell>

            <TableCell>{item.quantity}</TableCell>

            <TableCell>${(item.priceInCents / 100).toFixed(2)}</TableCell>

            <TableCell>${((item.quantity * item.priceInCents) / 100).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
