"use client"

import { Movie } from "@/generated/prisma/client"
import { Button } from "./ui/button"
import Link from "next/link"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./ui/table"
import { Avatar, AvatarImage } from "./ui/avatar"
import { MoveRight } from "lucide-react"
import { Field, FieldLabel } from "./ui/field"

type Props = {
  movies: Movie[]
//   page: number
//   pageSize: number
//   totalPages: number
}
function MovieTable({movies}:Props){
      return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Book Collection</h2>
          <p className="text-muted-foreground">
            Manage your books and their details
          </p>
        </div>
        <Button
          asChild
          className="bg-emerald-750 border-emerald-500 text-emerald-600 hover:bg-emerald-700 hover:text-emerald-100"
        >
          <Link href="/admin/movies/create">Add Book</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
              <Button variant="ghost">
                Title
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" >
                Genre
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" >
                Pice
              </Button>
            </TableHead>
            <TableHead>Release Year</TableHead>

            <TableHead className="text-right">...</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movies.map((movie) => (
            <TableRow key={movie.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage
                    src={movie.imageUrl ?? "placeHolder"} 
                    alt="@shadcn"
                    className="grayscale"
                  />
                </Avatar>
              </TableCell>
              <TableCell className="font-medium">{movie.title}</TableCell>
              <TableCell>{movie.genre?.name ?? 'No genre'}</TableCell>
              <TableCell>
                 
              </TableCell>

              <TableCell>movie</TableCell>

              <TableCell className="text-right">
                <Button
                  asChild
                  className="border-blue-900 text-blue-700 hover:bg-blue-900 hover:text-blue-100"
                  variant="secondary"
                >
                  <Link href={`/admin/movies/${movie.id}`}>
                    view
                    <MoveRight className="ml-2" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

     
      </Table>

    </div>
  )
}

export { MovieTable }