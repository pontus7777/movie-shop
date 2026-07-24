'use server'

import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session-validation'
import { revalidatePath } from 'next/cache'

export async function deleteGenre(id: number) {
  await requireAdmin()
  await prisma.genre.delete({
    where: { id },
  })

  revalidatePath('/admin/genres')
}
