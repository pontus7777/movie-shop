'use server'

import { revalidatePath, updateTag } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { createCrewSchema, type CreateCrewInput } from '@/lib/validations/crew'

export async function createCrew(values: CreateCrewInput) {
  await requireAdmin()
  const data = createCrewSchema.parse(values)

  const newCrew = await prisma.crew.create({
    data: {
      name: data.name,
    },
  })

  revalidatePath('/admin/crew')
  updateTag('movies')

  return newCrew
}
