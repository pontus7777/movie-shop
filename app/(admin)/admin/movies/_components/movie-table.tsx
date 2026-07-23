'use client'

import { Prisma } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { MoveRight } from 'lucide-react'
import placeHolder from '@/public/file.svg'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'

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

type MovieWithRelations = Prisma.MovieGetPayload<{
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
}

function MovieTable({ movies, currentPage, totalPages, currentPageSize }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function buildHref(page: number, pageSize: number = currentPageSize) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    params.set('pageSize', String(pageSize))
    return `?${params.toString()}`
  }

  function handlePageSizeChange(value: string) {
    // Reset to page 1 whenever page size changes, so we don't land on an out-of-range page
    router.push(buildHref(1, Number(value)))
  }
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Movie</h2>
          <p className="text-muted-foreground">Manage movies!</p>
        </div>
        <Button
          asChild
          className="bg-emerald-750 border-emerald-500 text-emerald-600 hover:bg-emerald-700 hover:text-emerald-100"
        >
          <Link href="/admin/movies/create">Add Movie</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Release Year</TableHead>
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
                  <Avatar>
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

                <TableCell>
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

                <TableCell>{movie.releaseYear}</TableCell>

                <TableCell className="text-right">
                  <Button asChild variant="secondary">
                    <Link href={`/admin/movies/${movie.id}`}>
                      View
                      <MoveRight />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

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

            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href={buildHref(index + 1)}
                  isActive={currentPage === index + 1}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(buildHref(index + 1), { scroll: false })
                  }}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

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
