'use client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Crew } from '@/generated/prisma/client'
import { editCrew } from '../_actions/edit-crew-action'
import { editCrewSchema } from '@/lib/validations/crew'

const editCrewNameSchema = editCrewSchema.pick({ name: true })

type Props = {
  crew: Crew
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCrewDialog({ crew, open, onOpenChange }: Props) {
  const form = useForm({
    defaultValues: {
      name: crew.name,
    },
    validators: {
      onSubmit: editCrewNameSchema,
      onBlur: editCrewNameSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await editCrew({
          id: crew.id,
          name: value.name,
        })

        toast.success('Crew updated')
        onOpenChange(false)
      } catch {
        toast.error('Failed to update crew')
      }
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) form.reset()
      }}
    >
      <DialogContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Edit Crew</DialogTitle>
            <DialogDescription>Update the crew member details.</DialogDescription>
          </DialogHeader>

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
