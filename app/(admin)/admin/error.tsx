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

export default function AdminError({
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
    <div className="bg-card flex min-h-[50vh] items-center justify-center rounded-xl border p-6 shadow-sm">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            This admin page failed to load. Please try again.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={() => unstable_retry()}>Try again</Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
