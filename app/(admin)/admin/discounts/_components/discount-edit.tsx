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
} from '@/components/ui/dialog'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { BulkDiscountTier } from '@/generated/prisma/client'
import { updateDiscountTier } from '../_actions/discount-actions'
import { discountTierSchema } from '@/lib/validations/discount'

type Props = {
  tier: BulkDiscountTier
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDiscountTierDialog({ tier, open, onOpenChange }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      minQuantity: tier.minQuantity,
      percentageOff: tier.percentageOff,
      active: tier.active,
    },
    validators: {
      onSubmit: discountTierSchema,
      onBlur: discountTierSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        await updateDiscountTier(tier.id, value)

        toast.success('Discount tier updated')
        onOpenChange(false)
        router.refresh()
      } catch (err) {
        console.log(err)
        toast.error('Failed to update discount tier', {
          position: 'bottom-center',
        })
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <DialogTitle>Edit discount tier</DialogTitle>
            <DialogDescription>
              Customers who add at least this many items to their cart get the discount
              automatically.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <form.Field name="minQuantity">
              {(field) => {
                const isInvalid = !field.state.meta.isValid
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
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="percentageOff">
              {(field) => {
                const isInvalid = !field.state.meta.isValid
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
                      aria-invalid={isInvalid}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
