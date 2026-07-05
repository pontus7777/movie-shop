'use client'

import { useTransition } from 'react'
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

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: any
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  function handleDelete() {
    startTransition(async () => {
      const res = await deleteUser({ id: user.id })
      router.refresh()
      if (!res.success) {
        toast.error(res.error)
        return
      }

      toast.success('User deleted')
      onOpenChange(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {user?.name}?</AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 text-white"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
