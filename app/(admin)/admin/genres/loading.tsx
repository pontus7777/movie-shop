import { Skeleton } from '@/components/ui/skeleton'

export default function AdminGenresLoading() {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  )
}
