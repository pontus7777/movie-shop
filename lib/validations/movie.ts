import { z } from 'zod'

const crewCreditSchema = z.object({
  id: z.string(),
  role: z.enum(['ACTOR', 'DIRECTOR']),
})

export const createMovieSchema = z
  .object({
    title: z.string().min(1).max(32),
    description: z.string().min(1).max(1000),
    price: z
      .string()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must be a valid number like 21.29'),
    releaseYear: z.number().min(0).max(9999),
    stock: z.boolean(),
    runtime: z.number().min(10),
    imageUrl: z.string(),

    salePrice: z
      .string()
      .refine(
        (val) => val === '' || /^\d+(\.\d{1,2})?$/.test(val),
        'Sale price must be a valid number like 4.99, or empty',
      ),
    saleStartsAt: z.string(), // datetime-local string, or '' for none
    saleEndsAt: z.string(),

    crew: z.array(crewCreditSchema).min(1, 'Select at least one crew member'),

    genreIds: z.array(z.number()).min(1, 'Select at least one genre'),
  })
  .refine(
    (data) => {
      if (!data.saleStartsAt || !data.saleEndsAt) return true
      return new Date(data.saleEndsAt) > new Date(data.saleStartsAt)
    },
    { message: 'Sale end date must be after the start date', path: ['saleEndsAt'] },
  )

export type CreateMovieInput = z.infer<typeof createMovieSchema>

// Fields the edit form itself owns. `id` is deliberately excluded here — the
// form never has it in its own state (it's the movie being edited, appended
// separately when calling the server action), so validating it client-side
// against the form's values would always fail with "id: undefined".
const editMovieFieldsSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(1000),
  price: z
    .string()
    .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must be a valid number like 21.29'),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.string(),

  salePrice: z
    .string()
    .refine(
      (val) => val === '' || /^\d+(\.\d{1,2})?$/.test(val),
      'Sale price must be a valid number like 4.99, or empty',
    ),
  saleStartsAt: z.string(), // datetime-local string, or '' for none
  saleEndsAt: z.string(),

  crew: z.array(crewCreditSchema),

  genreIds: z.array(z.number()),
})

function withSaleDateRefine<Schema extends z.ZodType<{ saleStartsAt: string; saleEndsAt: string }>>(
  schema: Schema,
) {
  return schema.refine(
    (data) => {
      if (!data.saleStartsAt || !data.saleEndsAt) return true
      return new Date(data.saleEndsAt) > new Date(data.saleStartsAt)
    },
    { message: 'Sale end date must be after the start date', path: ['saleEndsAt'] },
  )
}

// Used by the edit form's client-side validators.
export const editMovieFormSchema = withSaleDateRefine(editMovieFieldsSchema)
export type EditMovieFormInput = z.infer<typeof editMovieFormSchema>

// Used by the server action, which also owns `id`.
export const editMovieSchema = withSaleDateRefine(
  editMovieFieldsSchema.extend({ id: z.string().min(1) }),
)
export type EditMovieInput = z.infer<typeof editMovieSchema>
