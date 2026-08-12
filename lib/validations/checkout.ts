import { z } from 'zod'

// Shipping address only. Card details are collected by Stripe Checkout and
// never touch this app.
export const checkoutSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters.').max(50),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters.').max(50),
  street: z.string().trim().min(5, 'Street address is required.').max(100),
  postalCode: z.string().trim().min(4, 'Postal code is required.').max(12),
  city: z.string().trim().min(2, 'City is required.').max(50),
  country: z.string().trim().min(2, 'Country is required.').max(50),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
