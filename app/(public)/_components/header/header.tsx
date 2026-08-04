'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Suspense, useState } from 'react'
import { Menu, Film, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { CartButton } from './cart-button'
import { SearchButton } from './search-button'
import { UserActions } from './user-actions'
import { MobileMenu } from './mobile-menu'
import Logo from '../logo'
import { authClient } from '@/lib/auth-client'

export default function Header() {

  const { data: session } = authClient.useSession()
  const userName = session?.user.name ?? null
  const userImage = session?.user.image ?? null

  const pathname = usePathname()
  const isMoviesActive = pathname.startsWith('/movies')

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
            className={`
              flex items-center gap-2
              border-b-2 py-1.5
              text-sm font-medium
              transition-colors
              ${isMoviesActive
                ? 'border-primary text-primary'
                : 'border-transparent text-foreground hover:border-primary hover:text-primary'
              }
            `}
          >
            <Film className="h-5 w-5 text-primary" />
            Movies
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Suspense
            fallback={
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Search" disabled>
                <Search className="h-5 w-5" />
              </Button>
            }
          >
            <SearchButton />
          </Suspense>

          <CartButton />

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
