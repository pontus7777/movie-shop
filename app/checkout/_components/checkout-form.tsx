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

function CheckoutForm() {
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      street: '',
      postalCode: '',
      city: '',
      country: '',

      paymentMethod: 'CARD' as 'CARD' | 'PAYPAL' | 'SWISH',

      cardNumber: '',
      expiry: '',
      cvv: '',
    },

    validators: {
      onSubmit: checkoutSchema,
    },

    onSubmit: async ({ value }) => {
      try {
        await checkout(value)
        // toast.success('Order placed successfully!')
      } catch (error) {
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
          Enter your shipping and payment information to complete your order.
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
                  const invalid = field.state.meta.isTouched && !field.state.meta.isValid

                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={invalid}
                      />

                      {invalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.Field>
            ))}
            <Separator className="my-2" />

            <form.Field name="paymentMethod">
              {(field) => {
                const invalid = field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Payment Method</FieldLabel>

                    <select
                      id={field.name}
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value as 'CARD' | 'PAYPAL' | 'SWISH')
                      }
                    >
                      <option value="CARD">Credit Card</option>

                      <option value="PAYPAL">PayPal</option>

                      <option value="SWISH">Swish</option>
                    </select>

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.Field>

            <form.Subscribe selector={(state) => state.values.paymentMethod}>
              {(paymentMethod) =>
                paymentMethod === 'CARD' && (
                  <>
                    <form.Field name="cardNumber">
                      {(field) => {
                        const invalid = field.state.meta.isTouched && !field.state.meta.isValid

                        return (
                          <Field data-invalid={invalid}>
                            <FieldLabel htmlFor={field.name}>Card Number</FieldLabel>

                            <Input
                              id={field.name}
                              placeholder="1234 5678 9012 3456"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={
                                (e) => {
                                  const value = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 16)
                                    .replace(/(.{4})/g, '$1 ')
                                    .trim()

                                  field.handleChange(value)
                                }
                                // field.handleChange(e.target.value)
                              }
                              inputMode="numeric"
                              maxLength={19}
                              autoComplete="cc-number"
                            />

                            {invalid && <FieldError errors={field.state.meta.errors} />}
                          </Field>
                        )
                      }}
                    </form.Field>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <form.Field name="expiry">
                        {(field) => {
                          const invalid = field.state.meta.isTouched && !field.state.meta.isValid

                          return (
                            <Field data-invalid={invalid}>
                              <FieldLabel htmlFor={field.name}>Expiry</FieldLabel>

                              <Input
                                id={field.name}
                                placeholder="MM/YY"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={
                                  (e) => {
                                    let value = e.target.value.replace(/\D/g, '').slice(0, 4)

                                    if (value.length > 2) {
                                      value = `${value.slice(0, 2)}/${value.slice(2)}`
                                    }

                                    field.handleChange(value)
                                  }

                                  // field.handleChange(e.target.value)
                                }
                                inputMode="numeric"
                                maxLength={5}
                                autoComplete="cc-exp"
                              />

                              {invalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                          )
                        }}
                      </form.Field>

                      <form.Field name="cvv">
                        {(field) => {
                          const invalid = field.state.meta.isTouched && !field.state.meta.isValid
                          return (
                            <Field data-invalid={invalid}>
                              <FieldLabel htmlFor={field.name}>CVV</FieldLabel>

                              <Input
                                id={field.name}
                                placeholder="123"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                  field.handleChange(e.target.value.replace(/\D/g, '').slice(0, 3))
                                }}
                                inputMode="numeric"
                                maxLength={3}
                                autoComplete="cc-csc"
                              />
                              {invalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                          )
                        }}
                      </form.Field>
                    </div>
                  </>
                )
              }
            </form.Subscribe>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Processing...' : 'Place Order'}
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
