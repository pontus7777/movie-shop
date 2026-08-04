'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookHeart, Film, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserActions } from './user-actions'

type Props = {
  userName?: string | null
  userImage?: string | null
  onNavigate?: () => void
}

export function MobileMenu({ userName, userImage, onNavigate }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    params.set('page', '1')

    router.push(`/movies?${params.toString()}`)
    onNavigate?.()
  }

  return (
    <div className="flex flex-col gap-1 p-4" onClick={onNavigate}>
      <form
        onSubmit={handleSearch}
        className="mb-2 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          className="rounded-full"
        />

        <Button
          type="submit"
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-full"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      <Button variant="ghost" asChild className="justify-start">
        <Link href="/movies">
          <Film />
          Movies</Link>
      </Button>

      {userName && (
        <Button variant="ghost" asChild className="justify-start">
          <Link href="/wishlist">
            <BookHeart className="h-5 w-5" />
            Wishlist
          </Link>
        </Button>
      )}

      <div className="mt-2 border-t pt-2">
        <UserActions userName={userName} userImage={userImage} expanded />
      </div>
    </div>
  )
}
