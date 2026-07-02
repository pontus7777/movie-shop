'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenu,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Genre } from '@/generated/prisma/client'
import { MoreHorizontalIcon } from 'lucide-react'
import { deleteGenre } from '../_actions/delete-genre-action'

type TableGenreProps = {
  genres: Genre[]
}

function GenresTable({ genres }: TableGenreProps) {
  return (
    <Table>
      <TableCaption>A list of all available genres.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-25">Id</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {genres.slice().map((genre) => (
          <TableRow key={genre.id}>
            <TableCell className="font-medium">{genre.id}</TableCell>
            <TableCell>{genre.name}</TableCell>
            <TableCell>{genre.description}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={() => deleteGenre(genre.id)}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { GenresTable }
