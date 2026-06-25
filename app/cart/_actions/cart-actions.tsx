"use server"

import * as cartUtils from "@/lib/cart"

// const cart = [
//   {
//     id: 1,
//     quantity: 5,
//   }
// ]

// const cart2 = {
//   "jlkajsdkla": 5,
// }

export async function addToCart(id: string) {
  // Check that the id exists in the DB
  // const existingMovie = await prisma.movie.findUnique({
  //  where: { id },
  // })

  return await cartUtils.addToCart(id)
}

export async function removeFromCart(id: string, decrement = false) {
  return await cartUtils.removeFromCart(id, decrement)
}

export async function clearCart() {
  await cartUtils.clearCart()
}
