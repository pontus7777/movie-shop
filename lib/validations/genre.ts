import { z } from 'zod'

export const createGenreSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
})

export type CreateGenreInput = z.infer<typeof createGenreSchema>

export const editGenreSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
})

export type EditGenreInput = z.infer<typeof editGenreSchema>
