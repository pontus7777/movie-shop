'use client'

import { useState } from 'react'
import { toast } from 'sonner' // ★ NEW IMPORT
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { createGenre } from '../_actions/create-genre-action'

export default function AddGenreButton() {
  const [open, setOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string
    const description = formData.get('description') as string

    // ★ NEW: wrapped in try/catch so failures show feedback instead of silently doing nothing
    try {
      await createGenre({ name, description })
      toast.success(`Genre "${name}" added successfully`) // ★ NEW
      setOpen(false) // close modal after saving
    } catch {
      toast.error('Failed to add genre') // ★ NEW
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Genre</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Genre</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <input name="name" className="w-full border p-2" placeholder="Genre name" required />

          <textarea
            name="description"
            className="w-full border p-2"
            placeholder="Description"
            required
          />

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
