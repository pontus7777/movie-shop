'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/(public)/_components/cart-provider'

type Props = React.ComponentProps<typeof Button> & {
  movieId: string
  toastMessage: string
  action: (movieId: string) => Promise<unknown>
  cartChange?: number
}

function CartActionButton({ movieId, toastMessage, action, cartChange = 0, ...props }: Props) {
  const router = useRouter()
  const { updateCartCount } = useCart()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)

    try {
      await action(movieId)

      if (cartChange !== 0) {
        updateCartCount(cartChange)
      }

      toast.success(toastMessage)
      router.refresh()
    } catch {
      toast.error('Cart update failed')
    } finally {
      setLoading(false)
    }
  }

  return <Button {...props} onClick={handleClick} disabled={loading} />
}

export { CartActionButton }
