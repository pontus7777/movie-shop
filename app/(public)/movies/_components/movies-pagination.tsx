'use client'

import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type MoviesPaginationProps = {
  page: number
  totalPages: number
  query?: string
  genreIds?: number[]
  directorIds?: string[]
  actorIds?: string[]

  yearFrom?: string
  yearTo?: string
  runtimeMin?: string
  runtimeMax?: string
}

const SIBLING_COUNT = 1

/** Always shows first/last page, the current page, and one sibling on
 * each side, collapsing the rest into a single ellipsis per side. */
function getPageWindow(current: number, total: number): (number | 'ellipsis')[] {
  const totalVisible = SIBLING_COUNT * 2 + 5

  if (total <= totalVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const left = Math.max(current - SIBLING_COUNT, 2)
  const right = Math.min(current + SIBLING_COUNT, total - 1)

  const showLeftEllipsis = left > 2
  const showRightEllipsis = right < total - 1

  const pages: (number | 'ellipsis')[] = [1]

  if (showLeftEllipsis) {
    pages.push('ellipsis')
  } else {
    for (let p = 2; p < left; p++) pages.push(p)
  }

  for (let p = left; p <= right; p++) pages.push(p)

  if (showRightEllipsis) {
    pages.push('ellipsis')
  } else {
    for (let p = right + 1; p < total; p++) pages.push(p)
  }

  pages.push(total)

  return pages
}

export function MoviesPagination({
  page,
  totalPages,
  query,
  genreIds = [],
  directorIds = [],
  actorIds = [],
  yearFrom,
  yearTo,
  runtimeMin,
  runtimeMax,
}: MoviesPaginationProps) {
  const router = useRouter()

  const goToPage = (p: number) => {
    const params = new URLSearchParams()

    if (query) params.set('q', query)

    genreIds.forEach((id) => params.append('genre', String(id)))
    directorIds.forEach((id) => params.append('director', id))
    actorIds.forEach((id) => params.append('actor', id))

    if (yearFrom) params.set('yearFrom', yearFrom)
    if (yearTo) params.set('yearTo', yearTo)

    if (runtimeMin) params.set('runtimeMin', runtimeMin)
    if (runtimeMax) params.set('runtimeMax', runtimeMax)

    params.set('page', String(p))

    router.push(`/movies?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const pages = getPageWindow(page, totalPages)

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => goToPage(Math.max(1, page - 1))} />
        </PaginationItem>

        {pages.map((p, index) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink isActive={page === p} onClick={() => goToPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext onClick={() => goToPage(Math.min(totalPages, page + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
