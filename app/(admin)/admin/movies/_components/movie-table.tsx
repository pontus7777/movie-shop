'use client'

import { Prisma } from '@/generated/prisma/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { MoveRight } from 'lucide-react'
import placeHolder from '@/public/file.svg'
import { getMovieImageSrc } from '@/lib/image-utils'
import { convertToEuro } from '@/lib/priceUtils'
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableFooter,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

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
}
function MovieTable({ movies, currentPage, totalPages }: Props) {
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
                <TableCell className="font-medium">{movie.title}</TableCell>
                <TableCell>
                  {movie.genres.length > 0
                    ? movie.genres.map((g) => g.name).join(', ')
                    : 'No genre'}
                </TableCell>

                <TableCell>€{convertToEuro(movie.priceInCents)}</TableCell>
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

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={currentPage > 1 ? `?page=${currentPage - 1}` : '#'} />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink href={`?page=${index + 1}`} isActive={currentPage === index + 1}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext href={currentPage < totalPages ? `?page=${currentPage + 1}` : '#'} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

export { MovieTable }
