'use client'

import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
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

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => goToPage(Math.max(1, page - 1))} />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink isActive={page === pageNumber} onClick={() => goToPage(pageNumber)}>
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem>
          <PaginationNext onClick={() => goToPage(Math.min(totalPages, page + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
