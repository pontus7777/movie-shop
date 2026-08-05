import { Skeleton } from '@/components/ui/skeleton'

export default function AdminMoviesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-full sm:w-64" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Mobile: stacked movie cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-2/3 w-full max-w-40" />
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-md border md:block">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-none" />
        ))}
      </div>
    </div>
  )
}
