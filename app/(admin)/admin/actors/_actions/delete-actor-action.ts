import { Actor } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export async function deleteActor(actorId: Actor['id']): Promise<void> {
  prisma.actor.delete({
    where: {
      id:actorId,
    },
  })
}
