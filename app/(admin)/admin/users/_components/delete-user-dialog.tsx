'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

import { deleteUser } from '../_actions/delete-user-action'
import { useRouter } from 'next/navigation'
type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    id: string
    name: string
  }
}
export function DeleteUserDialog({ open, onOpenChange, user }: Props) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await deleteUser({
        id: user.id,
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      toast.success('User deleted')
      onOpenChange(false)
      router.refresh()
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete &quot;{user.name}&quot;?</AlertDialogTitle>
        </AlertDialogHeader>

        <p className="text-sm text-muted-foreground">This action cannot be undone.</p>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
