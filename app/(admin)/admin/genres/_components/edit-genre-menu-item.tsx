'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { editGenre } from '../_actions/edit-genre-action'
import { Genre } from '@/generated/prisma/client'
import { editGenreSchema } from '@/lib/validations/genre'

const editGenreFieldsSchema = editGenreSchema.pick({ name: true, description: true })

export function EditGenreMenuItem({ id, name, description }: Genre) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      name,
      description,
    },
    validators: {
      onSubmit: editGenreFieldsSchema,
      onBlur: editGenreFieldsSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await editGenre({
          id,
          name: value.name,
          description: value.description,
        })

        toast.success('Genre updated')
        setOpen(false)
      } catch {
        toast.error('Failed to update genre')
      }
    },
  })

  return (
    <>
      {/* Dropdown item that opens the modal */}
      <DropdownMenuItem
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
      >
        Edit Genre
      </DropdownMenuItem>

      {/* Modal */}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) form.reset()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Genre</DialogTitle>
          </DialogHeader>

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

              <form.Field name="description">
                {(field) => {
                  const isInvalid = !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
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
              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : 'Save Changes'}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
