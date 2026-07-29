import Image from 'next/image'
import { Minus, Plus, Trash } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CartActionButton } from '@/components/cart-action-button'

import { getCart } from '@/lib/cart'
import { addToCart, clearCart, removeFromCart } from './_actions/cart-actions'
import { calculateCartTotals } from '@/lib/discount'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import { getEffectivePriceInCents, isMovieOnSale } from '@/lib/pricing'
import { Badge } from '@/components/ui/badge'

export default async function CartPage() {
  const cart = await getCart()

  const isCartEmpty = cart.items.length === 0

  const { subtotal, discountPercentage, discountAmount, total } = await calculateCartTotals(
    cart.items,
  )

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="m-5 space-y-4">
          {cart.items.map((item) => {
            const onSale = isMovieOnSale(item.movie)
            const effectivePrice = getEffectivePriceInCents(item.movie)

            return (
              <Card key={item.movie.id}>
                <CardContent className="flex gap-4 p-4">
                  <Image
                    src={getMovieImageSrc(item.movie.imageUrl)}
                    alt={item.movie.title}
                    width={90}
                    height={130}
                    className="rounded-md object-cover"
                  />

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-semibold">{item.movie.title}</h3>
                      {onSale && (
                        <Badge className="bg-red-600 text-white hover:bg-red-600">Sale</Badge>
                      )}
                    </div>

                    <div className="mb-4 flex items-baseline gap-2">
                      <p
                        className={`text-sm ${onSale ? 'font-semibold text-red-600' : 'text-muted-foreground'}`}
                      >
                        €{convertToEuro(effectivePrice)} each
                      </p>
                      {onSale && (
                        <p className="text-muted-foreground text-xs line-through">
                          €{convertToEuro(item.movie.priceInCents)}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex items-center">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <CartActionButton
                          size="icon"
                          variant="outline"
                          movieId={item.movie.id}
                          action={async (movieId) => {
                            'use server'
                            await removeFromCart(movieId, true)
                          }}
                          cartChange={-1}
                          toastMessage="Removed one movie"
                        >
                          <Minus className="h-4 w-4" />
                        </CartActionButton>

                        <span className="w-8 text-center font-medium">{item.quantity}</span>

                        <CartActionButton
                          size="icon"
                          variant="outline"
                          movieId={item.movie.id}
                          action={addToCart}
                          cartChange={1}
                          toastMessage="Added one movie"
                        >
                          <Plus className="h-4 w-4" />
                        </CartActionButton>
                      </div>

                      {/* Line total */}
                      <p className="ml-auto mr-4 text-lg font-bold tracking-tight">
                        €{(convertToEuro(effectivePrice) * item.quantity).toFixed(2)}
                      </p>

                      {/* Remove */}
                      <CartActionButton
                        size="icon"
                        variant="ghost"
                        movieId={item.movie.id}
                        action={removeFromCart}
                        cartChange={-item.quantity}
                        toastMessage="Removed from cart"
                      >
                        <Trash className="h-4 w-4" />
                      </CartActionButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        <div className="m-5">
          <Card className="sticky top-16">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Bulk discount ({discountPercentage}% off)</span>
                  <span>-€{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <Separator />

              <CartActionButton
                className="w-full"
                variant="destructive"
                movieId=""
                action={async () => {
                  'use server'
                  await clearCart()
                }}
                cartChange={-cart.items.reduce((total, item) => total + item.quantity, 0)}
                toastMessage="Successfully cleared cart!"
              >
                Clear Cart
              </CartActionButton>

              {isCartEmpty ? (
                <Button className="w-full" disabled>
                  Checkout
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <a href="/checkout">Checkout</a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
