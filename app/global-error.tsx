'use client'

import './globals.css'

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          {error.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => unstable_retry()}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Try again
        </button>
      </body>
    </html>
  )
}
