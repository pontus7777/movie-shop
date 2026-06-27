import prisma from '@/lib/prisma'
import 'dotenv/config'

export async function main() {

  const sciFi = await prisma.genre.upsert({
  where: { name: 'Science Fiction' },
  update: {},
  create: {
    name: 'Science Fiction',
    description: 'Movies featuring futuristic technology and science.',
  },
})

const action = await prisma.genre.upsert({
  where: { name: 'Action' },
  update: {},
  create: {
    name: 'Action',
    description: 'Fast-paced movies with thrilling sequences.',
  },
})

const horror = await prisma.genre.upsert({
  where: { name: 'Horror' },
  update: {},
  create: {
    name: 'Horror',
    description: 'Scary movie!',
  },
})

const romance = await prisma.genre.upsert({
  where: { name: 'Romance' },
  update: {},
  create: {
    name: 'Romance',
    description: 'Love is life',
  },
})

const thriller = await prisma.genre.upsert({
  where: { name: 'Thriller' },
  update: {},
  create: {
    name: 'Thriller',
    description: 'The thrill',
  },
})


  const keanu = await prisma.crew.upsert({
    where: { id: 'actor-keanu-reeves' },
    update: {},
    create: {
      id: 'actor-keanu-reeves',
      name: 'Keanu Reeves',
      role:'ACTOR'

    },
  })

  const carrie = await prisma.crew.upsert({
    where: { id: 'actor-carrie-anne-moss' },
    update: {},
    create: {
      id: 'actor-carrie-anne-moss',
      name: 'Carrie-Anne Moss',
      role:'ACTOR'

    },
  })

  const leo = await prisma.crew.upsert({
    where: { id: 'actor-leonardo-dicaprio' },
    update: {},
    create: {
      id: 'actor-leonardo-dicaprio',
      name: 'Leonardo DiCaprio',
      role:'ACTOR'

    },
  })

  const joseph = await prisma.crew.upsert({
    where: { id: 'actor-joseph-gordon-levitt' },
    update: {},
    create: {
      id: 'actor-joseph-gordon-levitt',
      name: 'Joseph Gordon-Levitt',
      role:'ACTOR'
    },
  })

  const lana = await prisma.crew.upsert({
    where: { id: 'director-lana-wachowski' },
    update: {},
    create: {
      id: 'director-lana-wachowski',
      name: 'Lana Wachowski',
      role: 'DIRECTOR'
    },
  })

  const lilly = await prisma.crew.upsert({
    where: { id: 'director-lilly-wachowski' },
    update: {},
    create: {
      id: 'director-lilly-wachowski',
      name: 'Lilly Wachowski',
      role: 'DIRECTOR'
    },
  })

  const nolan = await prisma.crew.upsert({
    where: { id: 'director-christopher-nolan' },
    update: {},
    create: {
      id: 'director-christopher-nolan',
      name: 'Christopher Nolan',
      role: 'DIRECTOR'
    },
  })

  await prisma.movie.upsert({
    where: { id: 'movie-the-matrix' },
    update: {
      title: 'The Matrix',
      description: 'A hacker discovers reality is a simulation and joins the resistance.',
      price: 1499,
      releaseYear: 1999,
      imageUrl: 'https://picsum.photos/400/600?random=1',
      stock: true,
      runtime: 136,
      crewMembers: {
        set: [{ id: keanu.id }, { id: carrie.id }, { id: lana.id }, { id: lilly.id }],
      },
    },
    create: {
      id: 'movie-the-matrix',
      title: 'The Matrix',
      description: 'A hacker discovers reality is a simulation and joins the resistance.',
      price: 1499,
      releaseYear: 1999,
      imageUrl: 'https://picsum.photos/400/600?random=1',
      stock: true,
      runtime: 136,
     genres: { connect: { id: sciFi.id } },
      crewMembers: {
        connect: [{ id: keanu.id }, { id: carrie.id }, { id: lana.id }, { id: lilly.id }],
      },
    },
  })

  await prisma.movie.upsert({
    where: { id: 'movie-inception' },
    update: {
      title: 'Inception',
      description: 'A skilled thief enters dreams to steal secrets from targets.',
      price: 1699,
      releaseYear: 2010,
      imageUrl: 'https://picsum.photos/400/600?random=2',
      stock: true,
      runtime: 148,
     crewMembers: {
        set: [{ id: keanu.id }, { id: carrie.id }, { id: lana.id }, { id: lilly.id }],
      },
    },
    create: {
      id: 'movie-inception',
      title: 'Inception',
      description: 'A skilled thief enters dreams to steal secrets from targets.',
      price: 1699,
      releaseYear: 2010,
      imageUrl: 'https://picsum.photos/400/600?random=2',
      stock: true,
      runtime: 148,
      genres: { connect: { id: sciFi.id } },
     crewMembers: {
        connect: [{ id: keanu.id }, { id: carrie.id }, { id: lana.id }, { id: lilly.id }],
      },
    },
  })

  console.log('Seed finished')
}

// export async function main() {
// const genres = [
//   { name: "Action", description: "Fast-paced movies with intense sequences." },
//   { name: "Comedy", description: "Movies designed to make you laugh." },
//   { name: "Drama", description: "Emotionally driven storytelling." },
//   { name: "Horror", description: "Scary and suspenseful films." },
//   { name: "Sci-Fi", description: "Futuristic and science-based stories." },
//   { name: "Romance", description: "Love and relationship stories." },
//   { name: "Thriller", description: "Suspenseful and gripping narratives." },
//   { name: "Fantasy", description: "Magical and imaginative worlds." },
// ]

//   await prisma.genre.createMany({
//     data: genres,
//     skipDuplicates: true,
//   })

//   console.log("Genres seeded successfully")
// }

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
