import prisma from '../prisma'
import { clearCookieCart, getCookieCart } from './cookie-cart'

export async function mergeCookieCart(userId: string) {
  const cookieCart = await getCookieCart()

  // Nothing to merge
  if (Object.keys(cookieCart).length === 0) {
    return
  }

  // const cart = await prisma.cart.findUnique({
  //   where: {
  //     userId,
  //   },
  // })

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  })

  if (!cart) {
    throw new Error('Cart not found.')
  }

  for (const [movieId, quantity] of Object.entries(cookieCart)) {
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_movieId: {
          cartId: cart.id,
          movieId,
        },
      },
    })

    if (existingItem) {
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: {
            increment: quantity,
          },
        },
      })
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          movieId,
          quantity,
        },
      })
    }
  }

  await clearCookieCart()
}
