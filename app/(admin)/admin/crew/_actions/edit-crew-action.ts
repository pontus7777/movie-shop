'use server'

import { revalidatePath, updateTag } from 'next/cache'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { editCrewSchema, type EditCrewInput } from '@/lib/validations/crew'

export async function editCrew(values: EditCrewInput) {
  await requireAdmin()
  const data = editCrewSchema.parse(values)

  const updatedCrew = await prisma.crew.update({
    where: {
      id: data.id,
    },
    data: {
      name: data.name,
    },
  })

  revalidatePath('/admin/crew')
  updateTag('movies')

  return updatedCrew
}
