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
    </>
  )
}

// import { CartActionButton } from '@/components/cart-action-button'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table'
// import { getCart } from '@/lib/cart'
// import { getMovieImageSrc } from '@/lib/image-utils'
// import { getMovies, getMoviesByIds } from '@/lib/services/movie'
// import Image from 'next/image'
// import { addToCart, clearCart, removeFromCart } from './_actions/cart-actions'
// import { convertToEuro } from '@/lib/priceUtils'

// export default async function CartPage() {
//   const cart = await getCart()
//   const ids = Object.keys(cart)

//   const movies = await getMovies()
//   const cartMovies = await getMoviesByIds(ids)

//   let total = 0
//   const cartItems: { movie: (typeof cartMovies)[number]; quantity: number }[] = []

//   for (const id of ids) {
//     const movie = cartMovies.find((m) => m.id === id)
//     if (!movie) continue

//     total += convertToEuro(movie.priceInCents) * cart[id]
//     cartItems.push({
//       movie,
//       quantity: cart[id],
//     })
//   }

//   return (
//     <div className="mx-auto max-w-4xl space-y-6 p-4">
//       <div>
//         <h1 className="mb-2 text-2xl font-bold">Movies</h1>
//         <div className="grid grid-cols-3 gap-4">
//           {movies.map((m) => (
//             <Card key={m.id}>
//               <CardHeader>
//                 <CardTitle>{m.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Image
//                   alt="{m.title}"
//                   src={getMovieImageSrc(m.imageUrl)}
//                   width={300}
//                   height={400}
//                   loading="eager"
//                   priority
//                 />
//                 <p>€{convertToEuro(m.priceInCents)}</p>
//               </CardContent>
//               <CardFooter>
//                 <CartActionButton
//                   className="w-full"
//                   movieId={m.id}
//                   toastMessage="Successfully added to cart!"
//                   action={addToCart}
//                 >
//                   Add to cart
//                 </CartActionButton>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       </div>

//       <div>
//         <h1 className="mb-2 text-2xl font-bold">Cart</h1>

//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Movie</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Price</TableHead>
//               <TableHead>Remove</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {cartItems.map((item) => (
//               <TableRow key={`cart-item-${item.movie.id}`}>
//                 <TableCell>{item.movie.title}</TableCell>
//                 <TableCell>
//                   <div className="flex items-center gap-2">
//                     <CartActionButton
//                       size="icon-xs"
//                       variant="outline"
//                       movieId={item.movie.id}
//                       action={async (movieId) => {
//                         'use server'
//                         await removeFromCart(movieId, true)
//                       }}
//                       toastMessage="Successfully decremented cart item!"
//                     >
//                       -
//                     </CartActionButton>

//                     <div className="flex size-6 items-center justify-center rounded-md border font-medium">
//                       {item.quantity}
//                     </div>

//                     <CartActionButton
//                       size="icon-xs"
//                       variant="outline"
//                       movieId={item.movie.id}
//                       action={addToCart}
//                       toastMessage="Successfully incremented cart item!"
//                     >
//                       +
//                     </CartActionButton>
//                   </div>
//                 </TableCell>
//                 <TableCell>€{convertToEuro(item.movie.priceInCents) * item.quantity}</TableCell>
//                 <TableCell>
//                   <CartActionButton
//                     size="sm"
//                     variant="destructive"
//                     movieId={item.movie.id}
//                     action={removeFromCart}
//                     toastMessage="Successfully removed from cart!"
//                   >
//                     Remove
//                   </CartActionButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//           <TableFooter>
//             <TableRow>
//               <TableCell colSpan={2}>Total</TableCell>
//               <TableCell>€{total.toFixed(2)}</TableCell>
//               <TableCell>
//                 <CartActionButton
//                   size="sm"
//                   variant="destructive"
//                   action={async () => {
//                     'use server'
//                     await clearCart()
//                   }}
//                   movieId=""
//                   toastMessage="Successfully cleared cart!"
//                 >
//                   Clear Cart
//                 </CartActionButton>
//               </TableCell>
//               <TableCell>
//                 <Button asChild variant="default">
//                   <a href="/checkout">Checkout</a>
//                 </Button>
//               </TableCell>
//             </TableRow>
//           </TableFooter>
//         </Table>
//       </div>
//     </div>
//   )
// }
