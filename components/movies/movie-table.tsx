'use client'

import { Prisma } from '@/generated/prisma/client'
import { Button } from '../ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { MoveRight } from 'lucide-react'
import placeHolder from '@/public/file.svg'
import { getMovieImageSrc } from '@/lib/image-utils'

type MovieWithRelations = Prisma.MovieGetPayload<{
  include: {
    genres: true
    crewMembers: true
  }
}>

type Props = {
  movies: MovieWithRelations[]
  //   page: number
  //   pageSize: number
  //   totalPages: number
}
function MovieTable({ movies }: Props) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-sm">
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
            <TableHead>
              <Button variant="ghost">Title</Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">Genre</Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost">Pice</Button>
            </TableHead>
            <TableHead>Release Year</TableHead>

            <TableHead className="text-right">...</TableHead>
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

                <TableCell>{Number(movie.price)} kr</TableCell>
                <TableCell>{movie.releaseYear}</TableCell>

                <TableCell className="text-right">
                  <Button asChild variant="secondary">
                    <Link href={`/admin/movies/${movie.id}`}>
                      view
                      <MoveRight className="ml-2" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export { MovieTable }
