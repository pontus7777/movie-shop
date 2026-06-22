"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronDown, ShoppingCart, Search, Film } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeModeToggle } from "../theme-mode-toggle";
import { useState } from "react";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* ===== LOGO ===== */}
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <div className="bg-purple-600 rounded-lg p-1.5">
            <Film className="h-5 w-5 text-white" />
          </div>
          <span>
            Cine<span className="text-purple-500">Vault</span>
          </span>
        </Link>

        {/* ===== NAVIGATION ===== */}
        <nav className="hidden md:flex items-center gap-1">
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
              className={`transition-all duration-300 ease-in-out bg-muted border border-border rounded-full text-sm px-3 py-1.5 outline-none focus:border-purple-500 ${
                isSearchOpen ? "w-48 opacity-100 mr-2" : "w-0 opacity-0"
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
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* Cart item count badge */}
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Theme Toggle */}
          <ThemeModeToggle />

          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-1 rounded-full"
              >
                EN
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                EN (United State)
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                SV (Swedish)
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                FR (French)
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                DE (German)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Sign in / Sign up buttons */}
          <Button variant="ghost" className="font-medium">
            Sign in
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium">
            Sign up
          </Button>
        </div>
      </div>
    </header>
  );
}
