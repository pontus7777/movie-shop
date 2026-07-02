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
}

export function MoviesPagination({ page, totalPages, query }: MoviesPaginationProps) {
  const router = useRouter()

  const goToPage = (p: number) => {
    const q = query ? `&q=${encodeURIComponent(query)}` : ''
    router.push(`/movies?page=${p}${q}`)
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem>
          <PaginationPrevious onClick={() => goToPage(Math.max(1, page - 1))} />
        </PaginationItem>

        {/* Page numbers */}
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

        {/* Next */}
        <PaginationItem>
          <PaginationNext onClick={() => goToPage(Math.min(totalPages, page + 1))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
