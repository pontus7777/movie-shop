import { PrismaClient, Prisma } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function main() {
  // Genres
  const sciFi = await prisma.genre.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Science Fiction",
      description: "Movies featuring futuristic technology and science.",
    },
  });

  const action = await prisma.genre.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Action",
      description: "Fast-paced movies with thrilling sequences.",
    },
  });
  // Actors
  const keanu = await prisma.actor
    .create({
      data: { name: "Keanu Reeves" },
    })
    .catch(() =>
      prisma.actor.findFirstOrThrow({ where: { name: "Keanu Reeves" } }),
    );
  const carrie = await prisma.actor
    .create({
      data: { name: "Carrie-Anne Moss" },
    })
    .catch(() =>
      prisma.actor.findFirstOrThrow({ where: { name: "Carrie-Anne Moss" } }),
    );
  const leo = await prisma.actor
    .create({
      data: { name: "Leonardo DiCaprio" },
    })
    .catch(() =>
      prisma.actor.findFirstOrThrow({ where: { name: "Leonardo DiCaprio" } }),
    );
  const joseph = await prisma.actor
    .create({
      data: {
        name: "Joseph Gordon-Levitt",
      },
    })
    .catch(() =>
      prisma.actor.findFirstOrThrow({
        where: { name: "Joseph Gordon-Levitt" },
      }),
    );

  // Directors
  const lana = await prisma.director
    .create({
      data: { name: "Lana Wachowski" },
    })
    .catch(() =>
      prisma.director.findFirstOrThrow({ where: { name: "Lana Wachowski" } }),
    );

  const lilly = await prisma.director
    .create({
      data: { name: "Lilly Wachowski" },
    })
    .catch(() =>
      prisma.director.findFirstOrThrow({ where: { name: "Lilly Wachowski" } }),
    );

  const nolan = await prisma.director
    .create({
      data: { name: "Christopher Nolan" },
    })
    .catch(() =>
      prisma.director.findFirstOrThrow({
        where: { name: "Christopher Nolan" },
      }),
    );

  // Movies
  await prisma.movie.create({
    data: {
      title: "The Matrix",
      description:
        "A hacker discovers reality is a simulation and joins the resistance.",
      price: new Prisma.Decimal(14.99),
      releaseYear: 1999,
      imageUrl: "https://picsum.photos/400/600?random=1",
      stock: true,
      runtime: 136,
      genre: { connect: { id: sciFi.id } },
      actors: { connect: [{ id: keanu.id }, { id: carrie.id }] },
      directors: { connect: [{ id: lana.id }, { id: lilly.id }] },
    },
  });

  await prisma.movie.create({
    data: {
      title: "Inception",
      description:
        "A skilled thief enters dreams to steal secrets from targets.",
      price: new Prisma.Decimal(16.99),
      releaseYear: 2010,
      imageUrl: "https://picsum.photos/400/600?random=2",
      stock: true,
      runtime: 148,
      genre: { connect: { id: sciFi.id } },
      actors: { connect: [{ id: leo.id }, { id: joseph.id }] },
      directors: { connect: [{ id: nolan.id }] },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
