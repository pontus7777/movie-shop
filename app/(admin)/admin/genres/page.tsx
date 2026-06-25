import prisma from '@/lib/prisma'
import { GenresDataTable } from './_components/genres-data-table'
import { columns } from './_components/columns'
import AddGenreButton from './_components/add-genre-button'

export default async function AdminGenresPage() {
  const genres = await prisma.genre.findMany()

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Genres</h2>
          <p className="text-muted-foreground">All Genres</p>
        </div>

       <AddGenreButton />
  
      </div>
      {/* <GenresTable genres={genres} /> */}
    <GenresDataTable columns={columns} data={genres} />
    </div>
  )
}
