import prisma from '@/lib/prisma'
import { GenresTable } from './_components/admin-genres-table'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function AdminGenresPage() {
  const genres = await prisma.genre.findMany()

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Genres</h2>
          <p className="text-muted-foreground">All Genres</p>
        </div>

        <Button asChild>
          <Link href="/admin/genres/create">Add Genre</Link>
        </Button>
      </div>
      <GenresTable genres={genres} />
    </div>
  )
}
