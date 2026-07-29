'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCart } from '../cart-provider'

export function CartButton() {
    const { cartCount } = useCart()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full"
            asChild
        >
            <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />

                {cartCount > 0 && (
                    <span
                        className="
              absolute -right-1 -top-1
              flex h-5 min-w-5 items-center justify-center
              rounded-full bg-primary px-1
              text-[10px] font-bold text-white
            "
                    >
                        {cartCount > 9 ? '9+' : cartCount}
                    </span>
                )}
            </Link>
        </Button>
    )
}