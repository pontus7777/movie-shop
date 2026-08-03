'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { updateUser } from '../_actions/update-user-action'
import { useRouter } from 'next/navigation'
import { useForm } from '@tanstack/react-form'
import { updateUserSchema } from '@/lib/validations/user'

const editUserNameSchema = updateUserSchema.pick({ name: true })

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  user: {
    id: string
    name: string
  }
}

export function EditUserDialog({ open, onOpenChange, user }: Props) {
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onSubmit: editUserNameSchema,
      onBlur: editUserNameSchema,
    },

    onSubmit: async ({ value, formApi }) => {
      const result = await updateUser({
        id: user.id,
        name: value.name,
      })
      if (!result.success) {
        toast.error(result.error)
        return
      }
      formApi.reset({
        name: value.name,
      })
      router.refresh()
      toast.success('Form edited successfully', {})
      onOpenChange(false)
    },
  })

  useEffect(() => {
    form.reset({
      name: user.name,
    })
  }, [user, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4 py-4"
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
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Save'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
