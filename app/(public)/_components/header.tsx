'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Search, Film } from 'lucide-react'
import { ThemeModeToggle } from '../../../components/theme-mode-toggle'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function Header({
  userName,
  cartCount = 0,
}: {
  userName?: string | null
  cartCount?: number
}) {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [signingOut, setSigningOut] = useState(false)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!searchQuery.trim()) return
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
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <div className="bg-purple-600 rounded-lg p-1.5">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span>
            Cine<span className="text-purple-500">Vault</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className={`transition-all duration-300 ease-in-out bg-muted border border-border rounded-full text-sm px-3 py-1.5 outline-none focus:border-purple-500 ${
                isSearchOpen ? 'w-48 opacity-100 mr-2' : 'w-0 opacity-0'
              }`}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => {
                if (isSearchOpen && searchQuery.trim()) {
                  router.push(`/movies?q=${encodeURIComponent(searchQuery.trim())}&page=1`)
                } else {
                  setIsSearchOpen(!isSearchOpen)
                }
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Button>
          </Link>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />
          <ThemeModeToggle />
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {userName ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">Hi, {userName}</span>
              <Button
                variant="ghost"
                className="font-medium"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? 'Signing out...' : 'Sign out'}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" className="font-medium" asChild>
                <Link href={'/sign-in'}>Sign in</Link>
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium"
                asChild
              >
                <Link href={'/register'}>Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
