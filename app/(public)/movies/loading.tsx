import { Skeleton } from '@/components/ui/skeleton'
import { MOVIES_PAGE_SIZE } from './_lib/movie-query-helpers'

export default function MoviesLoading() {
  return (
    <main className="min-h-lvh px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto w-full max-w-350">
        <div className="mb-6">
          <Skeleton className="h-8 w-32" />
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          <aside className="hidden lg:block lg:w-64 lg:shrink-0">
            <Skeleton className="h-96 w-full" />
          </aside>

          <section className="min-w-0 flex-1">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: MOVIES_PAGE_SIZE }).map((_, i) => (
                <Skeleton key={i} className="aspect-2/3 w-full" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
