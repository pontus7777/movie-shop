'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Crew } from '@/generated/prisma/client'
import { MoreHorizontalIcon } from 'lucide-react'
import { deleteCrew } from '../_actions/delete-crew-action'
import { toast } from 'sonner'
import { Spinner } from '@/components/ui/spinner'
import { EditCrewDialog } from './crew-edit'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type Props = {
  crewMembers: Crew[]
}

export function CrewTable({ crewMembers }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')

  const size = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(crewMembers.length / size))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * size
  const paginatedCrew = crewMembers.slice(start, start + size)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  return (
    <div>
      <Table>
        <TableCaption>A list of all available crews.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">Index</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedCrew.map((cm, index) => (
            <TableRow key={cm.id}>
              <TableCell className="font-medium">{start + index + 1}</TableCell>
              <TableCell>{cm.name}</TableCell>

              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontalIcon />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditId(cm.id)}>Edit</DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem variant="destructive" onClick={() => setDeleteId(cm.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Delete dialog */}
                <AlertDialog open={deleteId === cm.id} onOpenChange={() => setDeleteId(null)}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete crew?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction
                        variant="destructive"
                        onClick={async () => {
                          try {
                            setLoading(true)
                            await deleteCrew(cm.id)
                            toast.success('Crew deleted')
                          } catch {
                            toast.error('Failed to delete crew')
                          } finally {
                            setLoading(false)
                            setDeleteId(null)
                          }
                        }}
                      >
                        {loading ? <Spinner /> : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Edit dialog */}
                {editId === cm.id && (
                  <EditCrewDialog crew={cm} open onOpenChange={() => setEditId(null)} />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="mt-4 flex items-center justify-between gap-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
          <Select
            value={pageSize}
            onValueChange={(value) => {
              setPageSize(value)
              setPage(1) // reset to page 1 whenever page size changes
            }}
          >
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
                href={`?page=${currentPage - 1}`}
                aria-disabled={isFirstPage}
                tabIndex={isFirstPage ? -1 : undefined}
                className={isFirstPage ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  if (!isFirstPage) setPage((p) => p - 1)
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href={`?page=${currentPage + 1}`}
                aria-disabled={isLastPage}
                tabIndex={isLastPage ? -1 : undefined}
                className={isLastPage ? 'pointer-events-none opacity-50' : ''}
                onClick={(e) => {
                  e.preventDefault()
                  if (!isLastPage) setPage((p) => p + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
