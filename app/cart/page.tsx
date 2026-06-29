import { getCart } from "@/lib/cart"
import { CartTestMovie, movies } from "@/lib/test-movie-data"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { CartActionButton } from "@/components/cart-action-button"
import { addToCart, clearCart, removeFromCart } from "./_actions/cart-actions"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function CartPage() {
  const cart = await getCart()

  const ids = Object.keys(cart)
  // const cartItems = ids.map((id) => {
  //   const product = products.find((prod) => prod.id === id);
  //   if (!product) return null;

  //   return {
  //     product,
  //     quantity: cart[id]
  //   }
  // }).filter(Boolean)

  let total = 0
  const cartItems: { movie: CartTestMovie; quantity: number }[] = []
  for (const id of ids) {
    const movie = movies.find((m) => m.id === id)
    if (!movie) continue

    total += movie.price * cart[id]
    cartItems.push({
      movie,
      quantity: cart[id],
    })
  }

  // const movies = await prisma.movie.findMany({
  //    where: { id: { in: ids }, deletedAt: null }
  // });

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Movies</h1>
        <div className="grid grid-cols-3 gap-4">
          {movies.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle>{m.name}</CardTitle>
              </CardHeader>
              <CardContent>{m.price} kr</CardContent>
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
                <TableCell>{item.movie.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CartActionButton
                      size="icon-xs"
                      variant="outline"
                      movieId={item.movie.id}
                      action={async (movieId) => {
                        "use server"
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
                    "use server"
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
