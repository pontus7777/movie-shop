import { z } from 'zod'

export const paymentMethods = ['CARD', 'PAYPAL', 'SWISH'] as const

export const checkoutSchema = z
  .object({
    firstName: z.string().trim().min(2, 'First name must be at least 2 characters.').max(50),

    lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.').max(50),

    street: z.string().trim().min(5, 'Street address is required.').max(100),

    postalCode: z.string().trim().min(4, 'Postal code is required.').max(12),

    city: z.string().trim().min(2, 'City is required.').max(50),

    country: z.string().trim().min(2, 'Country is required.').max(50),

    paymentMethod: z.enum(paymentMethods),

    cardNumber: z.string(),

    expiry: z.string(),

    cvv: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod !== 'CARD') {
      return
    }

    const cardNumber = data.cardNumber?.trim().replace(/\s/g, '')
    const expiry = data.expiry.trim()
    const cvv = data.cvv.trim()

    if (!/^\d{16}$/.test(cardNumber)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cardNumber'],
        message: 'Card number must contain exactly 16 digits.',
      })
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['expiry'],
        message: 'Expiry must be in MM/YY format.',
      })
      return
    } else {
      const [month, year] = data.expiry.split('/').map(Number)

      const now = new Date()
      const currentMonth = now.getMonth() + 1
      const currentYear = now.getFullYear() % 100

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['expiry'],
          message: 'Card has expired.',
        })
      }
    }

    if (!/^\d{3}$/.test(cvv)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cvv'],
        message: 'CVV must contain exactly 3 digits.',
      })
    }
  })

export type CheckoutInput = z.infer<typeof checkoutSchema>
