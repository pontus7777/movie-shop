import Image from 'next/image'
import Link from 'next/link'
import { User } from 'lucide-react'

type Props = {
  user: {
    name?: string | null
    image?: string | null
  } | null
}

export function UserMenu({ user }: Props) {
  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
      >
        <User className="h-4 w-4" />
        Login
      </Link>
    )
  }

  return (
    <Link
      href="/user"
      className="
        flex
        items-center
        gap-2
        rounded-md
        px-3
        py-2
        transition
        hover:bg-muted
      "
    >
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name ?? 'Profile'}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
      )}

      <span className="hidden text-sm font-medium sm:block">{user.name ?? 'Profile'}</span>
    </Link>
  )
}
