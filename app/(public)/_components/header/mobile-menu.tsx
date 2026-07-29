'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { UserActions } from './user-actions'
import { BookHeart } from 'lucide-react'

type Props = {
  userName?: string | null
  userImage?: string | null
}

export function MobileMenu({ userName, userImage }: Props) {
  return (
    <div className="border-t border-border bg-card px-4 py-4 md:hidden">
      <div className="flex flex-col gap-2">
        <Button variant="ghost" asChild>
          <Link href="/movies">Movies</Link>
        </Button>

        <input
          placeholder="Search movies..."
          className="
            w-full rounded-full border border-border
            bg-muted px-4 py-2 text-sm outline-none
          "
        />

        {userName && (
          <Button variant="ghost" asChild className="justify-start">
            <Link href="/wishlist">
              <BookHeart className="h-5 w-5" />
              Wishlist
            </Link>
          </Button>
        )}


        <UserActions userName={userName} userImage={userImage} />
      </div>
    </div>
  )
}
