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
import { createCrew } from '../_actions/create-crew-action'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCrewDialog({ open, onOpenChange }: Props) {
  const [name, setName] = useState('')
  // const [role, setRole] = useState<'ACTOR' | 'DIRECTOR'>('ACTOR')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    try {
      setLoading(true)

      await createCrew({ name })

      toast.success('Crew created')
      onOpenChange(false)
      setName('')
      // setRole('ACTOR')
    } catch {
      toast.error('Failed to create crew')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Crew</AlertDialogTitle>
          <AlertDialogDescription>Fill in the crew member details.</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <input
            className="w-full rounded border p-2"
            placeholder="Name"
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
          </select> */}
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
