import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type Props = {
  address: {
    firstName: string
    lastName: string
    street: string
    postalCode: string
    city: string
    country: string
  } | null
}

export function ShippingCard({ address }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <Separator />

      <CardContent>
        {address ? (
          <div className="space-y-2">
            <div>
              {address.firstName} {address.lastName}
            </div>

            <div>{address.street}</div>

            <div>
              {address.postalCode} {address.city}
            </div>

            <div>{address.country}</div>
          </div>
        ) : (
          <p>No shipping address.</p>
        )}
      </CardContent>
    </Card>
  )
}
