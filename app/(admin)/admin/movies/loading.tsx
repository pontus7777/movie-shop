import { Skeleton } from '@/components/ui/skeleton'

export default function AdminMoviesLoading() {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      {/* Mobile header (page.tsx shows this only below md) */}
      <div className="mb-6 flex items-center justify-between md:hidden">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Mobile: stacked movie cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="aspect-2/3 w-full max-w-40" />
        ))}
      </div>

      {/* Desktop: MovieTable has its own header + table */}
      <div className="hidden md:block">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>

        <div className="space-y-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
