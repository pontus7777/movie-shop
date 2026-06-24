'use client'

import { ChevronDown, ShoppingCart, Search, Film } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ThemeModeToggle } from './theme-mode-toggle'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* ===== LOGO ===== */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <div className="rounded-lg bg-purple-600 p-1.5">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span>
            Cine<span className="text-purple-500">Vault</span>
          </span>
        </Link>

        {/* ===== NAVIGATION ===== */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/">
            <Button variant="ghost" className="font-medium">
              Home
            </Button>
          </Link>
          <Link href="/movies">
            <Button variant="ghost" className="font-medium">
              Movies
            </Button>
          </Link>
          <Link href="/genres">
            <Button variant="ghost" className="font-medium">
              Genres
            </Button>
          </Link>
        </nav>

        {/* ===== RIGHT SIDE ACTIONS ===== */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {/* Expandable Search Input */}
            <input
              type="text"
              placeholder="Search movies..."
              className={`bg-muted border-border rounded-full border px-3 py-1.5 text-sm transition-all duration-300 ease-in-out outline-none focus:border-purple-500 ${
                isSearchOpen ? 'mr-2 w-48 opacity-100' : 'w-0 opacity-0'
              }`}
            />

            {/* Search Icon Button */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart with badge */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative rounded-full">
              <ShoppingCart className="h-5 w-5" />
              {/* Cart item count badge */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-purple-600 text-xs text-white">
                0
              </span>
            </Button>
          </Link>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Theme Toggle */}
          <ThemeModeToggle />

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1 rounded-full">
                EN
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                EN (United State)
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                SV (Swedish)
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                FR (French)
              </DropdownMenuItem>
              <DropdownMenuItem className="flex cursor-pointer items-center gap-2">
                DE (German)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Sign in / Sign up buttons */}
          <Button variant="ghost" className="font-medium">
            Sign in
          </Button>
          <Button className="rounded-full bg-purple-600 font-medium text-white hover:bg-purple-700">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  )
}
