'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createUser } from '../_actions/create-user-action'
import { Button } from '@/components/ui/button'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createUser({
        name: String(formData.get('name')),
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        role: String(formData.get('role')) as 'user' | 'admin',
      })

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('User created')

      onOpenChange(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create User</AlertDialogTitle>
          <AlertDialogDescription>Add a new user to the system</AlertDialogDescription>
        </AlertDialogHeader>

        {/* FORM */}
        <form action={handleSubmit} className="space-y-4 py-4">
          <input name="name" placeholder="Name" className="w-full rounded border p-2" />

          <input name="email" placeholder="Email" className="w-full rounded border p-2" />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full rounded border p-2"
          />

          <Select defaultValue="user" name="role">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending} className="">
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
