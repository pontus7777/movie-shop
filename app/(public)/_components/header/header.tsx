'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Film } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'

import { CartButton } from './cart-button'
import { SearchButton } from './search-button'
import { UserActions } from './user-actions'
import { MobileMenu } from './mobile-menu'
import Logo from '../logo'
import { WishlistHeaderButton } from './wishlist-button'
import { authClient } from '@/lib/auth-client'

type Props = {
  userName?: string | null
  userImage?: string | null
}

// export default function Header({ userName, userImage }: Props) {
export default function Header() {

  const { data: session } = authClient.useSession()
  const userName = session?.user.name ?? null
  const userImage = session?.user.image ?? null

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="
    sticky
    top-0
    z-50
    w-full
    border-b
    border-border
    bg-card/95
    backdrop-blur-md
  "
    >
      <div
        className="
          mx-auto flex max-w-7.5xl
          items-center justify-between
          px-4 py-3 sm:px-8
        "
      >
        <div className="flex items-center gap-5">
          <Logo />

          <Link
            href="/movies"
            className="
              flex items-center gap-2
              text-sm font-medium
            "
          >
            <Film className="h-5 w-5 text-primary" />
            Movies
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <SearchButton />

          <CartButton />

          <WishlistHeaderButton userName={userName} />

          <ThemeModeToggle />

          <UserActions userName={userName} userImage={userImage} />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartButton />

          {/* <WishlistHeaderButton userName={userName} /> */}

          <ThemeModeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {mobileOpen && <MobileMenu userName={userName} userImage={userImage} />}
    </header>
  )
}
