'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { Crew } from '@/generated/prisma/client'
import { editCrew } from '../_actions/edit-crew-action'

type Props = {
  crew: Crew
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCrewDialog({ crew, open, onOpenChange }: Props) {
  const [name, setName] = useState(crew.name)
  // const [role, setRole] = useState<'ACTOR' | 'DIRECTOR'>(crew.role)
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    try {
      setLoading(true)

      await editCrew({
        id: crew.id,
        name,
      })

      toast.success('Crew updated')
      onOpenChange(false)
    } catch {
      toast.error('Failed to update crew')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Crew</AlertDialogTitle>
          <AlertDialogDescription>Update the crew member details.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <input
            className="w-full rounded border p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* <select
            className="w-full border rounded p-2"
            value={role}
            onChange={(e) => setRole(e.target.value as 'ACTOR' | 'DIRECTOR')}
          >
            <option value="ACTOR">Actor</option>
            <option value="DIRECTOR">Director</option>
          </select>*/}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving…' : 'Save'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
