import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { CheckoutForm } from './_components/checkout-form'
import { OrderSummary } from './_components/order-summary'

export default async function CheckoutPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect('/sign-in')
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <CheckoutForm />
        <OrderSummary />
      </div>
    </div>
  )
}
