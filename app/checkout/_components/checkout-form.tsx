'use client'

import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'

import { checkout } from '../_actions'

import { checkoutSchema } from '@/lib/validations/checkout'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

type checkoutFormProps = {
  isCartEmpty: boolean
}

function CheckoutForm({ isCartEmpty }: checkoutFormProps) {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      street: '',
      postalCode: '',
      city: '',
      country: '',
    },

    validators: {
      onSubmit: checkoutSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await checkout(value)
      } catch (error) {
        if (isRedirectError(error)) {
          throw error
        }
        toast.error(error instanceof Error ? error.message : 'Checkout failed.')
      }
    },
  })

  const textFields = [
    ['firstName', 'First Name'],
    ['lastName', 'Last Name'],
    ['street', 'Street'],
    ['postalCode', 'Postal Code'],
    ['city', 'City'],
    ['country', 'Country'],
  ] as const

  return (
    <Card className="mx-auto w-full sm:max-w-2xl">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>
          Enter your shipping address. Payment is handled securely by Stripe on the next step.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            await form.handleSubmit()
          }}
          className="space-y-6"
        >
          <FieldGroup className="flex flex-col gap-5">
            {textFields.map(([name, label]) => (
              <form.Field key={name} name={name}>
                {(field) => {
                  const isInvalid = !field.state.meta.isValid

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
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
            ))}

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting || isCartEmpty} className="w-full">
                  {isCartEmpty
                    ? 'Cart is empty'
                    : isSubmitting
                      ? 'Redirecting…'
                      : 'Continue to Payment'}
                </Button>
              )}
            </form.Subscribe>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

export { CheckoutForm }
