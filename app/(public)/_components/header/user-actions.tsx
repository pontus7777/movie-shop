'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Loader2, LogOut, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  userName?: string | null
  userImage?: string | null
}

export function UserActions({ userName, userImage }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function signOut() {
    try {
      setLoading(true)
      await authClient.signOut()
      router.refresh()
      router.replace('/')
    } finally {
      setLoading(false)
    }
  }

  if (!userName) {
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>

        <Button
          variant="default"
          className="bg-primary text-primary-foreground hover:bg-primary/80"
          asChild
        >
          <Link href="/register">Register</Link>
        </Button>
      </>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        className="
          flex items-center gap-2
          rounded-full px-2 py-1
          transition hover:bg-muted
        "
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
          <div
            className="
              flex h-8 w-8 items-center justify-center
              rounded-full bg-muted
            "
          >
            <User className="h-4 w-4" />
          </div>
        )}

        <span className="hidden text-sm font-medium lg:block">{userName}</span>
      </Link>

      <Button variant="ghost" onClick={signOut} disabled={loading} className="gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing out...
          </>
        ) : (
          <>
            <LogOut className="h-4 w-4" />
            {/* Sign out */}
          </>
        )}
      </Button>
    </div>
  )
}
