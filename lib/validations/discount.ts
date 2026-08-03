import { z } from 'zod'

export const discountTierSchema = z.object({
  minQuantity: z.number().int('Must be a whole number').min(1, 'Must be at least 1'),
  percentageOff: z
    .number()
    .int('Must be a whole number')
    .min(1, 'Must be at least 1%')
    .max(100, 'Cannot exceed 100%'),
  active: z.boolean(),
})

export type DiscountTierInput = z.infer<typeof discountTierSchema>
