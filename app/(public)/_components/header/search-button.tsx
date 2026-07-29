'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function SearchButton() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!query.trim()) {
      router.push('/movies')
      return
    }

    router.push(`/movies?q=${encodeURIComponent(query.trim())}&page=1`)
  }

  return (
    <form onSubmit={submit} className="flex items-center">
      <input
        disabled={!open}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search movies..."
        className={`
          rounded-full border border-border bg-muted
          text-sm outline-none transition-all duration-300
          ${open ? 'mr-2 w-48 px-3 py-1.5 opacity-100' : 'w-0 px-0 opacity-0'}
        `}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setOpen((v) => !v)}
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  )
}
