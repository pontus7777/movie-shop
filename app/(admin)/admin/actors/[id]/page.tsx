import { Edit } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import prisma from '@/lib/prisma'

export default async function MovieDetailsPage(props: PageProps<'/admin/actors/[id]'>) {
  const params = await props.params

  if (!params.id) {
    notFound()
  }

  const actor = await prisma.actor.findUnique({
    where: {
      id: params.id,
    },
    include: {
      movies: true,
    },
  })

  if (!actor) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold">{actor.name}</h1>
          {/* <p className="text-muted-foreground">{actor.movies.title ?? 'No movie'}</p> */}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" asChild>
            <Link href={`/admin/actors/${actor.id}/edit`}>
              <Edit />
              Edit
            </Link>
          </Button>

          {/* <Button
            action={async () => {
              "use server"

              await prisma.actor.delete({
                where: {
                  id: actor.id,
                },
              })
            }}
          /> */}
        </div>
      </div>
    </div>
  )
}
