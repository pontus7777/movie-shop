import prisma from '../prisma'

export async function getDatabaseCart(userId: string) {
  const cart = await prisma.cart.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  })

  return prisma.cart.findUnique({
    where: {
      id: cart.id,
    },
    include: {
      items: {
        include: {
          movie: true,
        },
        orderBy: {
          id: 'asc',
        },
      },
    },
  })
}

export async function addToDatabaseCart(userId: string, movieId: string) {
  const cart = await prisma.cart.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  })

  //   if (!cart) {
  //     throw new Error('Cart not found.')
  //   }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_movieId: {
        cartId: cart.id,
        movieId,
      },
    },
  })

  if (existingItem) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          increment: 1,
        },
      },
    })
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      movieId,
      quantity: 1,
    },
  })
}

export async function removeFromDatabaseCart(userId: string, movieId: string, decrement = false) {
  const cart = await prisma.cart.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
  })

  //   if (!cart) {
  //     return
  //   }

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_movieId: {
        cartId: cart.id,
        movieId,
      },
    },
  })

  if (!existingItem) {
    return
  }

  if (decrement && existingItem.quantity > 1) {
    return prisma.cartItem.update({
      where: {
        id: existingItem.id,
      },
      data: {
        quantity: {
          decrement: 1,
        },
      },
    })
  }

  return prisma.cartItem.delete({
    where: {
      id: existingItem.id,
    },
  })
}

export async function clearDatabaseCart(userId: string) {
  const cart = await prisma.cart.findUnique({
    where: {
      userId,
    },
  })

  if (!cart) {
    return
  }

  return prisma.cartItem.deleteMany({
    where: {
      cartId: cart.id,
    },
  })
}
