'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Genre } from '@/generated/prisma/client'
import { GenresDataTable } from './genres-data-table'
import { columns } from './columns'
import AddGenreButton from './add-genre-button'

export function AdminGenresPageClient({ genres }: { genres: Genre[] }) {
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Genres</h2>
          <p className="text-muted-foreground">All Genres</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search genres..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <AddGenreButton />
        </div>
      </div>

      <GenresDataTable columns={columns} data={genres} search={search} />
    </div>
  )
}
