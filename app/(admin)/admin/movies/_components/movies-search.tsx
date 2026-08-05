'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function MoviesSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') ?? '')

  function handleSearch(value: string) {
    setSearch(value)

    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set('q', value)
    } else {
      params.delete('q')
    }

    params.set('page', '1')

    router.push(`?${params.toString()}`)
  }

  return (
    <div className="relative w-full sm:w-64">
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
      <Input
        placeholder="Search movies..."
        className="pl-8"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  )
}
