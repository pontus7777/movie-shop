'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'

export default function CheckoutError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center py-8">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>Checkout failed to load</EmptyTitle>
          <EmptyDescription>
            Something went wrong while loading checkout. Your cart is safe — please try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => unstable_retry()}>Try again</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
