'use client'

import Link from 'next/link'
import { BookHeart } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
    userName?: string | null
}

export function WishlistHeaderButton({ userName }: Props) {
    if (!userName) return null

    return (
        <Button variant="ghost" size="icon" className="relative rounded-full" asChild>
            <Link href="/wishlist">
                <BookHeart className="h-5 w-5" />
            </Link>
        </Button>
    )
}