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
    <div className="mx-auto max-w-4xl space-y-6 p-4">
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
      {/* <div>
        <h1 className="mb-2 text-2xl font-bold">Movies</h1>
        <div className="grid grid-cols-3 gap-4">
          {movies.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>{m.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  alt="{m.title}"
                  src={getMovieImageSrc(m.imageUrl)}
                  width={300}
                  height={400}
                  loading="eager"
                  priority
                />
                <p>€{convertToEuro(m.priceInCents)}</p>
              </CardContent>
              <CardFooter>
                <CartActionButton
                  className="w-full"
                  movieId={m.id}
                  toastMessage="Successfully added to cart!"
                  action={addToCart}
                >
                  Add to cart
                </CartActionButton>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div> */}

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
    </div>
  )
}
