import { CartActionButton } from '@/components/cart-action-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCart } from '@/lib/cart'
import { addToCart, clearCart, removeFromCart } from './_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'
import { getMovieImageSrc } from '@/lib/image-utils'
import Image from 'next/image'
import { Minus, Plus, Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export default async function CartPage() {
  const cart = await getCart()
  // const ids = Object.keys(cart)

  // const movies = await getMovies()
  // const cartMovies = await getMoviesByIds(ids)

  const total = cart.items.reduce(
    (sum, item) => sum + convertToEuro(item.movie.priceInCents) * item.quantity,
    0,
  )

  return (
    <>
      {/* <div className="mx-auto max-w-4xl space-y-6 p-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold">My Cart</h1>

          <div className="grid grid-cols-3 gap-4">
            {cart.items.map((item) => (
              <Card key={item.movie.id}>
                <CardHeader>
                  <CardTitle>{item.movie.title}</CardTitle>
                </CardHeader>

                <CardContent>
                  <Image
                    alt={item.movie.title}
                    src={getMovieImageSrc(item.movie.imageUrl)}
                    width={300}
                    height={400}
                    loading="eager"
                    priority
                  />

                  <p>€{convertToEuro(item.movie.priceInCents)}</p>

                  <p>Quantity: {item.quantity}</p>
                </CardContent>

                <CardFooter>
                  <CartActionButton
                    className="w-full"
                    movieId={item.movie.id}
                    toastMessage="Successfully added to cart!"
                    action={addToCart}
                  >
                    Add one more
                  </CartActionButton>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h1 className="mb-2 text-2xl font-bold">Cart</h1>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movie</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow key={item.movie.id}>
                  <TableCell>{item.movie.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CartActionButton
                        size="icon-xs"
                        variant="outline"
                        movieId={item.movie.id}
                        action={async (movieId) => {
                          'use server'
                          await removeFromCart(movieId, true)
                        }}
                        toastMessage="Successfully decremented cart item!"
                      >
                        -
                      </CartActionButton>

                      <div className="flex size-6 items-center justify-center rounded-md border font-medium">
                        {item.quantity}
                      </div>

                      <CartActionButton
                        size="icon-xs"
                        variant="outline"
                        movieId={item.movie.id}
                        action={addToCart}
                        toastMessage="Successfully incremented cart item!"
                      >
                        +
                      </CartActionButton>
                    </div>
                  </TableCell>
                  <TableCell>
                    €{(convertToEuro(item.movie.priceInCents) * item.quantity).toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <CartActionButton
                      size="sm"
                      variant="destructive"
                      movieId={item.movie.id}
                      action={removeFromCart}
                      toastMessage="Successfully removed from cart!"
                    >
                      Remove
                    </CartActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell>€{total.toFixed(2)}</TableCell>
                <TableCell className="flex gap-2">
                  <CartActionButton
                    size="sm"
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

                  <Button asChild>
                    <a href="/checkout">Checkout</a>
                  </Button>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div> */}
      {/* ================================================================================================ */}

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

                  <p className="text-muted-foreground">€{convertToEuro(item.movie.priceInCents)}</p>

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
                      <Minus />
                    </CartActionButton>

                    <span className="w-8 text-center">{item.quantity}</span>

                    <CartActionButton
                      size="icon"
                      variant="outline"
                      movieId={item.movie.id}
                      action={addToCart}
                      toastMessage="Added one movie"
                    >
                      <Plus />
                    </CartActionButton>
                    <p> €{(convertToEuro(item.movie.priceInCents) * item.quantity).toFixed(2)}</p>
                    <CartActionButton
                      variant="ghost"
                      className="ml-auto"
                      movieId={item.movie.id}
                      action={removeFromCart}
                      toastMessage="Removed from cart"
                    >
                      <Trash />
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
              <div className="flex justify-between">
                <span>Sum of Items</span>
                <span>€{total.toFixed(2)}</span>
              </div>
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

              <Button asChild className="w-full">
                <a href="/checkout">Checkout</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* ======================================================================================================= */}
    </>
  )
}
