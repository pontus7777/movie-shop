'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'

import { authClient } from '@/lib/auth-client'

import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

type Props = React.ComponentProps<typeof Button>

export function DeleteUserAccountButton({ ...buttonProps }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)

      await authClient.deleteUser()

      // router.push() won't work because the session disappears.
      window.location.href = '/goodbye'
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...buttonProps} variant="destructive">
          <Trash2 className="h-4 w-4" />
          Delete Account
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete your account?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action is permanent and cannot be undone. Your account and all
            associated data will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={isDeleting}
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}


// 'use client'

// import { Button } from '@/components/ui/button'
// import { Trash2 } from 'lucide-react'
// import { authClient } from '@/lib/auth-client'

// type Props = React.ComponentProps<typeof Button>

// export function DeleteUserAccountButton({ ...buttonProps }: Props) {
//   async function handleClick() {
//     const confirmed = confirm(
//       'Are you sure you want to delete your account? This action cannot be undone.',
//     )

//     if (!confirmed) return

//     await authClient.deleteUser()
//     window.location.href = '/goodbye'
//     // router.push() dont work here because the router instance is gone after deleteUser()
//   }

//   return (
//     <Button {...buttonProps} onClick={handleClick}>
//       <Trash2 className="h-4 w-4" />
//       Delete Account
//     </Button>
//   )
// }

