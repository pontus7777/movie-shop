'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteGenre(id: number) {
  await prisma.genre.delete({
    where: { id },
  })

  revalidatePath('/admin/genres')
}
