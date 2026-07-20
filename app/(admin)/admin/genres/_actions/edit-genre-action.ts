'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const editGenreSchema = z.object({
  id: z.number().transform((val) => Number(val)),
  name: z.string().min(1),
  description: z.string().min(1),
})

export async function editGenre(values: z.infer<typeof editGenreSchema>) {
  await requireAdmin()
  const data = editGenreSchema.parse(values)

  const updatedGenre = await prisma.genre.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
      description: data.description,
    },
  })

  revalidatePath('/admin/genres')

  return {
    ...updatedGenre,
  }
}
