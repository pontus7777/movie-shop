import { getCart } from '@/lib/cart'
import { getMovies, getMoviesByIds } from '@/lib/services/movie'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { CartActionButton } from '@/components/cart-action-button'
import { addToCart, clearCart, removeFromCart } from './_actions/cart-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function CartPage() {
  const cart = await getCart()

  const ids = Object.keys(cart)

  const movies = await getMovies()
  const cartMovies = await getMoviesByIds(ids)
  let total = 0

  const cartItems = cartMovies.map((movie) => {
    const quantity = cart[movie.id]

    total += movie.price * quantity

    return {
      movie,
      quantity,
    }
  })

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
                <img src={m.imageUrl ?? '/placeholder.jpg'} />
                <p>{m.price} kr</p>
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
        {/* {movies.map((movie) => (
        <CartItem movie={movie} quantity={cart[movie.id]} />
        ))} */}

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
            {/* <TableRow>
              <TableCell>Product 1</TableCell>
              <TableCell>1</TableCell>
              <TableCell>100 kr</TableCell>
              <TableCell></TableCell>
            </TableRow> */}

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
                <TableCell>{item.movie.price * item.quantity} kr</TableCell>
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
              <TableCell>{total} kr</TableCell>
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
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
