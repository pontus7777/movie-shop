'use client'

import { Genre } from '@/generated/prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { EditGenreMenuItem } from './edit-genre-menuitem'
import { DeleteGenreDialog } from './delete-genre-dialog' // ★ NEW

export const columns: ColumnDef<Genre>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const genre = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(genre.id.toString())}>
              Genre ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <EditGenreMenuItem
              id={genre.id}
              description={genre.description}
              name={genre.name}
            />

            {/* ★ NEW — delete dialog menu item */}
            <DeleteGenreDialog id={genre.id} name={genre.name} />
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
