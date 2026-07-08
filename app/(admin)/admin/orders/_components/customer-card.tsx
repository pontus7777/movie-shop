import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

type Props = {
  user: {
    name: string
    email: string
    role: string | null
    emailVerified: boolean
  }
}

export function CustomerCard({ user }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer</CardTitle>
      </CardHeader>
      <Separator />

      <CardContent className="space-y-2">
        <div>
          <strong>Name:</strong> {user.name}
        </div>

        <div>
          <strong>Email:</strong> {user.email}
        </div>

        <div>
          <strong>Role:</strong> {user.role}
        </div>

        <div>
          <strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}
        </div>
      </CardContent>
    </Card>
  )
}
