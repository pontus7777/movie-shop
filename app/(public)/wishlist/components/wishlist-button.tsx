'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { toggleWishlist } from '../_actions/wishlist-action'
import { useRouter } from 'next/navigation'

type Props = {
  movieId: string
  initialIsWishlisted: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
}

export function WishlistButton({
  movieId,
  initialIsWishlisted,
  size = 'icon',
  variant = 'outline',
}: Props) {
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    const next = !isWishlisted
    setIsWishlisted(next) // optimistic update

    startTransition(async () => {
      const result = await toggleWishlist(movieId)

      if (!result.success) {
        setIsWishlisted(!next) // revert optimistic update
        toast.error('Please sign in to use your wishlist.')
        router.push('/sign-in')
        return
      }

      setIsWishlisted(result.wishlisted)
      toast.success(result.wishlisted ? 'Added to wishlist' : 'Removed from wishlist')
    })
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current text-red-500')} />
    </Button>
  )
}
