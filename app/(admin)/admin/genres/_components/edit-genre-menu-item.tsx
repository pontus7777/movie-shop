'use client'

import { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { editGenre } from '../_actions/edit-genre-action'
import { Genre } from '@/generated/prisma/client'

export function EditGenreMenuItem({ id, name, description }: Genre) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Dropdown item that opens the modal */}
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        Edit Genre
      </DropdownMenuItem>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Genre</DialogTitle>
          </DialogHeader>

          <form
            action={async (formData) => {
              await editGenre({
                id: Number(formData.get('id')),
                name: String(formData.get('name')),
                description: String(formData.get('description')),
              })

              setOpen(false)
            }}
            className="space-y-4"
          >
            <input type="hidden" name="id" value={id} />

            <input name="name" defaultValue={name} className="w-full border p-2" />

            <textarea name="description" defaultValue={description} className="w-full border p-2" />

            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
