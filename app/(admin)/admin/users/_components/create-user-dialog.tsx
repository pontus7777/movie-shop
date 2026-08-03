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
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { createUserSchema, type CreateUserInput } from '@/lib/validations/user'

type FormValues = CreateUserInput

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: Props) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    } as FormValues,
    validators: {
      onSubmit: createUserSchema,
      onBlur: createUserSchema,
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
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) form.reset()
      }}
    >
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
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="email@email.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="password">
              {(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      placeholder="Password"
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="role">
              {(field) => {
                const isInvalid = !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Role</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) => field.setValue(value as FormValues['role'])}
                    >
                      <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>
          </FieldGroup>

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating…' : 'Create'}
                </Button>
              )}
            </form.Subscribe>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
