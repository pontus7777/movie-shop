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
import { ThemeModeToggle } from "./theme-mode-toggle";
import { useState } from "react";

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
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
        {/* ===== RIGHT SIDE ACTIONS ===== */}
        <div className="flex items-center gap-2">
          {/* Expandable Search */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search movies..."
              className={`transition-all duration-300 ease-in-out bg-muted border border-border rounded-full text-sm px-3 py-1.5 outline-none focus:border-purple-500 ${
                isSearchOpen ? "w-48 opacity-100 mr-2" : "w-0 opacity-0"
              }`}
            />

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

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1" />

          {/* Sign in / Register buttons */}
          <Button variant="ghost" className="font-medium" asChild>
            <Link href={"/sign-in"}>Sign in</Link>
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full font-medium"
            asChild
          >
            <Link href={"/register"}>Register</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
