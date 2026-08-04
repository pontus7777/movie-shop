import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { convertToEuro } from '@/lib/priceUtils'

type Props = {
  total: number
}

export function OrderSummaryCard({ total }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between">
          <span>Total</span>

          <span>€{convertToEuro(total).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
