'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { deleteGenre } from '../_actions/delete-genre-action'

export function DeleteGenreDialog({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await deleteGenre(id)
      toast.success(`Genre "${name}" deleted`)
      setOpen(false)
    } catch {
      toast.error('Failed to delete genre')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Menu item that opens the dialog */}
      <DropdownMenuItem
        variant="destructive"
        onSelect={(e) => {
          e.preventDefault() // prevents dropdown from closing instantly
          setOpen(true)
        }}
      >
        Delete Genre
      </DropdownMenuItem>

      {/* Confirmation dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>

          <p>This action cannot be undone. This will permanently delete &quot;{name}&quot;.</p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
