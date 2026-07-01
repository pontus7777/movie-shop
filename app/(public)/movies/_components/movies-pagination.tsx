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
}

export function MoviesPagination({ page, totalPages }: MoviesPaginationProps) {
  const router = useRouter()

  const goToPage = (p: number) => {
    router.push(`/movies?page=${p}`)
  }

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
