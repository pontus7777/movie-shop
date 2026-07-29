'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { UserActions } from './user-actions'

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

        <UserActions userName={userName} userImage={userImage} />
      </div>
    </div>
  )
}
