'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Film } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { CartButton } from './cart-button'
import { SearchButton } from './search-button'
import { UserActions } from './user-actions'
import { MobileMenu } from './mobile-menu'
import Logo from '../logo'
import { WishlistHeaderButton } from './wishlist-button'
import { authClient } from '@/lib/auth-client'

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

          <ThemeModeToggle />

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>

            <SheetContent side="right">
              <SheetHeader className="border-b">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <MobileMenu
                userName={userName}
                userImage={userImage}
                onNavigate={() => setMobileOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
