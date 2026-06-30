'use server'

import { revalidatePath } from 'next/cache'

import prisma from '@/lib/prisma'

export async function deleteCrew(crewId: string) {
  await prisma.crewOnMovie.deleteMany({
    where: {
      crewId,
    },
  })

  await prisma.crew.delete({
    where: {
      id: crewId,
    },
  })

  revalidatePath('/admin/crew')
}
