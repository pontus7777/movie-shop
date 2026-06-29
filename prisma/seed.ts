import prisma from '@/lib/prisma'
import 'dotenv/config'

async function main() {
  console.log('Seeding database...')

  // --- GENRES ---
  const genres = await prisma.genre.createMany({
    data: [
      { name: 'Action', description: 'High energy and intense scenes' },
      { name: 'Drama', description: 'Emotional and narrative-driven stories' },
      { name: 'Comedy', description: 'Humorous and entertaining films' },
      { name: 'Sci-Fi', description: 'Futuristic and science-based stories' },
    ],
  })

  // --- MOVIES ---
  const movie1 = await prisma.movie.create({
    data: {
      title: 'The Last Horizon',
      description: 'A sci-fi adventure beyond the edge of the galaxy.',
      price: 129,
      releaseYear: 2024,
      imageUrl: 'https://picsum.photos/400/600?random=1',
      stock: true,
      runtime: 142,
      rating: 8.5,
      genres: { connect: [{ id: 1 }, { id: 4 }] },
    },
  })

  const movie2 = await prisma.movie.create({
    data: {
      title: 'Broken Silence',
      description: 'A dramatic story of redemption and courage.',
      price: 99,
      releaseYear: 2023,
      imageUrl: 'https://picsum.photos/400/600?random=2',
      stock: true,
      runtime: 118,
      rating: 7.9,
      genres: { connect: [{ id: 2 }] },
    },
  })

  const movie3 = await prisma.movie.create({
    data: {
      title: 'Laugh Out Loud',
      description: 'A comedy that will leave you in tears.',
      price: 79,
      releaseYear: 2022,
      imageUrl: 'https://picsum.photos/400/600?random=3',
      stock: true,
      runtime: 95,
      rating: 7.2,
      genres: { connect: [{ id: 3 }] },
    },
  })

  // --- CREW ---
  const crew1 = await prisma.crew.create({
    data: { name: 'John Actor', movieId: movie1.id },
  })

  const crew2 = await prisma.crew.create({
    data: { name: 'Sarah Director', movieId: movie1.id },
  })

  const crew3 = await prisma.crew.create({
    data: { name: 'Mike Actor', movieId: movie2.id },
  })

  // --- CREW ON MOVIE ---
  await prisma.crewOnMovie.createMany({
    data: [
      { crewId: crew1.id, movieId: movie1.id, role: 'ACTOR' },
      { crewId: crew2.id, movieId: movie1.id, role: 'DIRECTOR' },
      { crewId: crew3.id, movieId: movie2.id, role: 'ACTOR' },
    ],
  })

  // --- USER ---
  const user = await prisma.user.create({
    data: {
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'user',
      banned: false,
    },
  })

  // --- CART ---
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
    },
  })

  await prisma.cartItem.createMany({
    data: [
      { cartId: cart.id, movieId: movie1.id, quantity: 1 },
      { cartId: cart.id, movieId: movie2.id, quantity: 2 },
    ],
  })

  // --- ORDER ---
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: 327,
      paymentMethod: 'CARD',
      firstName: 'Demo',
      lastName: 'User',
      street: 'Example Street 12',
      postalCode: '12345',
      city: 'Linköping',
      country: 'Sweden',
    },
  })

  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        movieId: movie1.id,
        quantity: 1,
        price: 129,
      },
      {
        orderId: order.id,
        movieId: movie2.id,
        quantity: 2,
        price: 99,
      },
    ],
  })

  console.log('🌱 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
