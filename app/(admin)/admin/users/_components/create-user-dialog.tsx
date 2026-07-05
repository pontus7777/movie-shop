'use client'

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
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
})

type FormValues = z.infer<typeof formSchema>

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: Props) {
  const router = useRouter()
  const defaultValues: FormValues = {
    name: '',
    email: '',
    password: '',
    role: 'user',
  }
  const form = useForm({
    defaultValues,

    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await createUser(value)

      if (!result.success) {
        toast.error(result.error)
        return
      }

      toast.success('User created')

      formApi.reset()

      onOpenChange(false)
      router.refresh()
    },
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create User</AlertDialogTitle>
          <AlertDialogDescription>Add a new user to the system.</AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field
            name="name"
            children={(field) => (
              <input
                className="w-full rounded border p-2"
                placeholder="Name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <form.Field
            name="email"
            children={(field) => (
              <input
                className="w-full rounded border p-2"
                placeholder="Email"
                type="email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <form.Field
            name="password"
            children={(field) => (
              <input
                className="w-full rounded border p-2"
                placeholder="Password"
                type="password"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <form.Field
            name="role"
            children={(field) => (
              <Select
                value={field.state.value}
                onValueChange={(value) => field.setValue(value as FormValues['role'])}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>

            <Button type="submit">Create</Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
