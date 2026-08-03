import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']),
})

export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(32, 'Name must be less than 32 characters'),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

//========================================
// Update user verification schema
//========================================
export const updateUserVerificationSchema = z.object({
  id: z.string(),
  emailVerified: z.boolean(),
})

export type UpdateUserVerificationInput = z.infer<typeof updateUserVerificationSchema>

/**
 * =================================
 * Delete user schema
 * =========================
 */
export const deleteUserSchema = z.object({
  id: z.string(),
})

export type DeleteUserInput = z.infer<typeof deleteUserSchema>
