'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { ShoppingCart, Search, Film, Menu, X, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ThemeModeToggle } from '../../../components/theme-mode-toggle'
import { authClient } from '@/lib/auth-client'

export default function Header({
  userName,
  userImage,
  cartCount = 0,
}: {
  userName?: string | null
  userImage?: string | null
  cartCount?: number
}) {
  const router = useRouter()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [signingOut, setSigningOut] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!searchQuery.trim()) {
      router.push('/movies')
      return
    }

    router.push(`/movies?q=${encodeURIComponent(searchQuery.trim())}&page=1`)
  }

  async function handleSignOut() {
    setSigningOut(true)

    await authClient.signOut()

    setSigningOut(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            <div className="rounded-lg bg-purple-600 p-1.5">
              <Film className="h-5 w-5 text-white" />
            </div>

            <span>
              Cine<span className="text-purple-500">Vault</span>
            </span>
          </Link>

          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/movies">Movies</Link>
          </Button>
        </div>

        {/* Desktop */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className={`rounded-full border border-border bg-muted px-3 py-1.5 text-sm outline-none transition-all ${
                isSearchOpen ? 'mr-2 w-48 opacity-100' : 'w-0 opacity-0'
              }`}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative rounded-full" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          </Button>

          <ThemeModeToggle />

          {/* Profile */}
          {userName ? (
            <div className="flex items-center gap-3">
              <Link
                href="/user"
                className="flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-muted"
              >
                {userImage ? (
                  <Image
                    src={userImage}
                    alt={userName}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}

                <span className="hidden text-sm font-medium lg:block">{userName}</span>
              </Link>

              <Button variant="ghost" onClick={handleSignOut} disabled={signingOut}>
                {signingOut ? 'Signing out...' : 'Sign out'}
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign in</Link>
              </Button>

              <Button className="rounded-full bg-purple-600 text-white hover:bg-purple-700" asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ShoppingCart className="h-5 w-5" />

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold text-white">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Button>
          </Link>

          {userName && (
            <Link href="/user">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={userName}
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  <User className="h-4 w-4" />
                </div>
              )}
            </Link>
          )}

          <ThemeModeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" asChild>
              <Link href="/movies">Movies</Link>
            </Button>

            <form onSubmit={handleSearchSubmit}>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full rounded-full border border-border bg-muted px-4 py-2 text-sm outline-none"
              />
            </form>

            {userName ? (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/user">Profile</Link>
                </Button>

                <Button variant="ghost" onClick={handleSignOut}>
                  {signingOut ? 'Signing out...' : 'Sign out'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/sign-in">Sign in</Link>
                </Button>

                <Button className="rounded-full bg-purple-600 text-white" asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
