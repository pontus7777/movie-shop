'use client'

import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'
import { createDiscountTier } from '../_actions/discount-actions'

const formSchema = z.object({
  minQuantity: z.number().int().min(1, 'Must be at least 1'),
  percentageOff: z.number().int().min(1, 'Must be at least 1%').max(100, 'Cannot exceed 100%'),
  active: z.boolean(),
})

export function CreateDiscountTierButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      minQuantity: 1,
      percentageOff: 1,
      active: true,
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        await createDiscountTier(value)

        toast.success('Discount tier created')
        setOpen(false)
        form.reset()
        router.refresh()
      } catch (err) {
        console.log(err)
        toast.error('Failed to create discount tier', {
          position: 'bottom-center',
        })
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) form.reset()
      }}
    >
      <DialogTrigger asChild>
        <Button>Add Discount Tier</Button>
      </DialogTrigger>

      <DialogContent>
        <form
          method="POST"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <DialogHeader>
            <DialogTitle>Add discount tier</DialogTitle>
            <DialogDescription>
              Customers who add at least this many items to their cart get the discount
              automatically.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <form.Field name="minQuantity">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Minimum quantity</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      min={1}
                      step={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="percentageOff">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Discount percentage</FieldLabel>
                    <Input
                      id={field.name}
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(Number(e.target.value))}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="active">
              {(field) => (
                <Field orientation="horizontal">
                  <Switch
                    id={field.name}
                    checked={field.state.value}
                    onCheckedChange={(checked) => field.handleChange(checked)}
                    onBlur={field.handleBlur}
                  />
                  <FieldLabel htmlFor={field.name}>Active</FieldLabel>
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
