'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { LogOut, Popcorn } from 'lucide-react'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'

export function UserPageHeader() {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
  }

  return (
    <header className="bg-background/80 sticky top-0 z-50 border-b border-white/10 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* ===== HOME LINK ===== */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <div className="rounded-lg bg-primary p-1.5">
            <Popcorn className="h-5 w-5 text-white" />
          </div>
          <span>
            Cine<span className="text-primary">Vault</span>
          </span>
        </Link>

        {/* ===== RIGHT SIDE ACTIONS ===== */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeModeToggle />

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            className="flex items-center gap-2 rounded-full bg-primary font-medium text-white hover:bg-primary/80"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
