import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAuth } from '@/lib/session-validation'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{
    orderId?: string
  }>
}

export default async function SuccessPage({ searchParams }: Props) {
  await requireAuth()

  const { orderId } = await searchParams

  return (
    <>
      <Card className="mx-auto mt-16 max-w-xl">
        <CardHeader className="text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
          <CardTitle className="text-3xl text-green-600">Payment Successful</CardTitle>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">Order ID</p>
          <p className="font-medium">
            <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
              {orderId}
            </Badge>
          </p>
        </CardContent>
        <Button asChild>
          <Link href="/movies">Continue shopping</Link>
        </Button>
      </Card>

      {/* <div className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-4xl font-bold text-green-600">Payment Successful</h1>

        <p className="mt-6">Thank you for your purchase.</p>

        <p className="mt-2 font-medium">Order ID: {orderId}</p>

      </div> */}
    </>
  )
}
