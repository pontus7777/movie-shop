import { CartActionButton } from '@/components/cart-action-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { getCart } from '@/lib/cart'
import { addToCart, clearCart, removeFromCart } from './_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import Image from 'next/image'
import { Minus, Plus, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { calculateCartTotals } from '@/lib/discount'
// import { requireAuth } from '@/lib/session-validation'

export default async function CartPage() {
  // await requireAuth()
  const cart = await getCart()

  const isCartEmpty = cart.items.length === 0

  // const total = cart.items.reduce(
  //   (sum, item) => sum + convertToEuro(item.movie.priceInCents) * item.quantity,
  //   0,
  // )

  const { subtotal, discountPercentage, discountAmount, total } = await calculateCartTotals(
    cart.items,
  )

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="m-5 space-y-4">
          {cart.items.map((item) => (
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
                  <h3 className="text-lg font-semibold">{item.movie.title}</h3>

                  <p className="text-muted-foreground mb-4 text-sm">
                    €{convertToEuro(item.movie.priceInCents)} each
                  </p>

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
                        toastMessage="Added one movie"
                      >
                        <Plus className="h-4 w-4" />
                      </CartActionButton>
                    </div>

                    {/* Line total */}
                    <p className="ml-auto mr-4 text-lg font-bold tracking-tight">
                      €{(convertToEuro(item.movie.priceInCents) * item.quantity).toFixed(2)}
                    </p>

                    {/* Remove */}
                    <CartActionButton
                      size="icon"
                      variant="ghost"
                      movieId={item.movie.id}
                      action={removeFromCart}
                      toastMessage="Removed from cart"
                    >
                      <Trash className="h-4 w-4" />
                    </CartActionButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="m-5">
          <Card className="sticky top-16">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* <div className="flex justify-between">
                <span>Sum of Items</span>
                <span>€{total.toFixed(2)}</span>
              </div>
              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
              </div> */}

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
                action={async () => {
                  'use server'
                  await clearCart()
                }}
                movieId=""
                toastMessage="Successfully cleared cart!"
              >
                Clear Cart
              </CartActionButton>

              {/* <Button asChild className="w-full">
                <a href="/checkout">Checkout</a>
              </Button> */}

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
