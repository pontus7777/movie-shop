'use client'

import { useState } from 'react'
import { editCrew } from '../_actions/edit-crew-action'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Crew } from '@/generated/prisma/client'

type Props = {
  crew: Crew
}

export function EditCrewDialog({ crew }: Props) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(crew.name)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    try {
      setLoading(true)

      await editCrew({
        id: crew.id,
        name,
        role: crew.role,
      })

      toast.success('Crew updated')
      setOpen(false)
    } catch {
      toast.error('Failed to update crew')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>Edit</AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Crew</AlertDialogTitle>
            <AlertDialogDescription>Update the crew’s information.</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            <input
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setName(e.target.value)
              }}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
