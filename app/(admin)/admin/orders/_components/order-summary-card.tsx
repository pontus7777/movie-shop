import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

          <span>${(total / 100).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
