import { z } from 'zod'

export const createCrewSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  movieIds: z.array(z.string()).optional(),
})

export type CreateCrewInput = z.infer<typeof createCrewSchema>

export const editCrewSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Name is required'),
  movieIds: z.array(z.string()).optional(),
})

export type EditCrewInput = z.infer<typeof editCrewSchema>
