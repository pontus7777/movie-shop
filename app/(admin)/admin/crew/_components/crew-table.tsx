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

type Props = {
  crewMembers: Crew[]
}

export function CrewTable({ crewMembers }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <>
      <Table>
        <TableCaption>A list of all available crews.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {crewMembers.map((cm, index) => (
            <TableRow key={cm.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{cm.name}</TableCell>
              <TableCell>{cm.role}</TableCell>

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

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setDeleteId(cm.id)}>Delete</DropdownMenuItem>
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

                {/* Create dialog */}
                {/* {createOpen && (
                  <CreateCrewDialog
                    open
                    onOpenChange={() => setCreateOpen(false)}
                  />
                )} */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
