import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { convertToEuro } from '@/lib/priceUtils'

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

            <TableCell>€{convertToEuro(item.priceInCents).toFixed(2)}</TableCell>

            <TableCell>€{convertToEuro(item.quantity * item.priceInCents).toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
