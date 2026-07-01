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
import { getMovieImageSrc } from '@/lib/image-utils'
import { getMovies, getMoviesByIds } from '@/lib/services/movie'
import Image from 'next/image'
import { addToCart, clearCart, removeFromCart } from './_actions/cart-actions'
import { convertToEuro } from '@/lib/priceUtils'

export default async function CartPage() {
  const cart = await getCart()
  const ids = Object.keys(cart)

  const movies = await getMovies()
  const cartMovies = await getMoviesByIds(ids)

  let total = 0
  const cartItems: { movie: (typeof cartMovies)[number]; quantity: number }[] = []

  for (const id of ids) {
    const movie = cartMovies.find((m) => m.id === id)
    if (!movie) continue

    total += convertToEuro(movie.priceInCents) * cart[id]
    cartItems.push({
      movie,
      quantity: cart[id],
    })
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div>
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
            {cartItems.map((item) => (
              <TableRow key={`cart-item-${item.movie.id}`}>
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
                <TableCell>€{convertToEuro(item.movie.priceInCents) * item.quantity}</TableCell>
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
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Button asChild variant="default">
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
