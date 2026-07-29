'use client'

import { useState } from 'react'
import { Minus, Plus, ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { addToCart, removeFromCart } from '../cart/_actions/cart-actions'
import { useCart } from './cart-provider'

type Props = {
  movieId: string
  initialQuantity: number
}

export function MovieCartButton({ movieId, initialQuantity }: Props) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [loading, setLoading] = useState(false)

  const { updateCartCount } = useCart()

  async function add() {
    setLoading(true)

    try {
      await addToCart(movieId)

      setQuantity((prev) => prev + 1)
      updateCartCount(1)

      toast.success('Added to cart')
    } catch {
      toast.error('Could not add movie')
    } finally {
      setLoading(false)
    }
  }

  async function remove() {
    if (quantity <= 0) return

    setLoading(true)

    try {
      await removeFromCart(movieId, true)

      setQuantity((prev) => Math.max(0, prev - 1))
      updateCartCount(-1)

      toast.success('Removed from cart')
    } catch {
      toast.error('Could not remove movie')
    } finally {
      setLoading(false)
    }
  }

  if (quantity === 0) {
    return (
      <Button className="h-7 w-full text-[11px] sm:h-8 sm:text-xs" onClick={add} disabled={loading}>
        <ShoppingCart className="mr-1 h-3 w-3" />
        Add
      </Button>
    )
  }

  return (
    <div className="flex gap-1">
      <Button className="h-7 flex-1 sm:h-8" onClick={remove} disabled={loading}>
        <Minus className="h-3 w-3" />
      </Button>

      <div className="flex h-7 flex-1 items-center justify-center rounded-md border text-xs sm:h-8">
        {quantity}
      </div>

      <Button className="h-7 flex-1 sm:h-8" onClick={add} disabled={loading}>
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  )
}
