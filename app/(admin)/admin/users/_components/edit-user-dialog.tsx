'use client'

import { useTransition, useState, useEffect } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { updateUser } from '../_actions/update-user-action'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from '@tanstack/react-form'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(32, 'Name must be less than 32 characters'),
})
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
      onSubmit: formSchema,
      onChange: formSchema,
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
          <form.Field
            name="name"
            children={(field) => (
              <input
                className="w-full rounded border p-2"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
