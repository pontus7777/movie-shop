import { Button } from '@/components/ui/button'
import { Popcorn } from 'lucide-react'
import Link from 'next/link'

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/"
        className="flex items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl"
      >
        <div className="rounded-lg bg-primary p-1.5">
          <Popcorn className="h-8 w-8 text-white" />
        </div>

        <span>
          Cine<span className="text-primary">Vault</span>
        </span>
      </Link>
    </div>
  )
}
