'use client'

import { Prisma } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { ArrowRight, ArrowUp, ArrowDown, ArrowUpDown, Star } from 'lucide-react'
import placeHolder from '@/public/file.svg'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'
import type { MovieSortKey } from '../page'

import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export type MovieWithRelations = Prisma.MovieGetPayload<{
  include: {
    genres: true
    credits: {
      include: { crew: true }
    }
  }
}>

type Props = {
  movies: MovieWithRelations[]
  currentPage: number
  totalPages: number
  currentPageSize: number
  currentSort: MovieSortKey
  currentOrder: Prisma.SortOrder
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

const SORT_LABELS: Record<MovieSortKey, string> = {
  title: 'Title',
  releaseYear: 'Release Year',
  price: 'Price',
  rating: 'Rating',
}

function SortableHead({
  sortKey,
  currentSort,
  currentOrder,
  onSort,
}: {
  sortKey: MovieSortKey
  currentSort: MovieSortKey
  currentOrder: Prisma.SortOrder
  onSort: (key: MovieSortKey) => void
}) {
  const isActive = currentSort === sortKey
  const Icon = isActive ? (currentOrder === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown

  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="hover:text-foreground flex items-center gap-1 font-medium"
      >
        {SORT_LABELS[sortKey]}
        <Icon className={`size-3.5 ${isActive ? '' : 'text-muted-foreground'}`} />
      </button>
    </TableHead>
  )
}

function MovieTable({
  movies,
  currentPage,
  totalPages,
  currentPageSize,
  currentSort,
  currentOrder,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function buildHref(page: number, pageSize: number = currentPageSize) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    return `?${params.toString()}`
  }

  function buildSortHref(key: MovieSortKey) {
    const params = new URLSearchParams(searchParams.toString())
    const nextOrder = currentSort === key && currentOrder === 'asc' ? 'desc' : 'asc'
    params.set('sort', key)
    params.set('order', nextOrder)
    params.set('page', '1')
    return `?${params.toString()}`
  }

  function handlePageSizeChange(value: string) {
    // Reset to page 1 whenever page size changes, so we don't land on an out-of-range page
    router.push(buildHref(1, Number(value)))
  }

  function handleSort(key: MovieSortKey) {
    router.push(buildSortHref(key), { scroll: false })
  }

  return (
    <div>
      <div className="bg-card overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead></TableHead>
              <SortableHead
                sortKey="title"
                currentSort={currentSort}
                currentOrder={currentOrder}
                onSort={handleSort}
              />
              <TableHead>Genre</TableHead>
              <SortableHead
                sortKey="price"
                currentSort={currentSort}
                currentOrder={currentOrder}
                onSort={handleSort}
              />
              <SortableHead
                sortKey="releaseYear"
                currentSort={currentSort}
                currentOrder={currentOrder}
                onSort={handleSort}
              />
              <SortableHead
                sortKey="rating"
                currentSort={currentSort}
                currentOrder={currentOrder}
                onSort={handleSort}
              />
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movies.map((movie) => {
              const imageSrc = getMovieImageSrc(movie.imageUrl)
              const onSale = isMovieOnSale(movie)
              const effectivePrice = getEffectivePriceInCents(movie)

              return (
                <TableRow key={movie.id}>
                  <TableCell>
                    <Avatar className="ring-border ring-1">
                      <AvatarImage
                        src={imageSrc || placeHolder.src}
                        alt={movie.title}
                        className="grayscale"
                      />
                    </Avatar>
                  </TableCell>

                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {movie.title}
                      {onSale && (
                        <Badge className="bg-red-600 text-white hover:bg-red-600">Sale</Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {movie.genres.length > 0
                      ? movie.genres.map((g) => g.name).join(', ')
                      : 'No genre'}
                  </TableCell>

                  <TableCell>
                    {onSale ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-medium text-red-600">
                          €{convertToEuro(effectivePrice)}
                        </span>
                        <span className="text-muted-foreground text-xs line-through">
                          €{convertToEuro(movie.priceInCents)}
                        </span>
                      </div>
                    ) : (
                      <span>€{convertToEuro(movie.priceInCents)}</span>
                    )}
                  </TableCell>

                  <TableCell className="text-muted-foreground">{movie.releaseYear}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                      {movie.imdbRating ? movie.imdbRating.toFixed(1) : '—'}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/admin/movies/${movie.id}`}>
                        View
                        <ArrowRight />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select value={String(currentPageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20" id="select-rows-per-page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start">
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={currentPage > 1 ? buildHref(currentPage - 1) : '#'}
                aria-disabled={currentPage <= 1}
                className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) router.push(buildHref(currentPage - 1), { scroll: false })
                }}
              />
            </PaginationItem>

            {getPageWindow(currentPage, totalPages).map((p, index) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={buildHref(p)}
                    isActive={currentPage === p}
                    onClick={(e) => {
                      e.preventDefault()
                      router.push(buildHref(p), { scroll: false })
                    }}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href={currentPage < totalPages ? buildHref(currentPage + 1) : '#'}
                aria-disabled={currentPage >= totalPages}
                className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages)
                    router.push(buildHref(currentPage + 1), { scroll: false })
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export { MovieTable }
