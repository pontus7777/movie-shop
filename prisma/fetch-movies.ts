import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

// "Find or create" helper functions
async function getOrCreateGenre(name: string) {
  let genre = await prisma.genre.findFirst({ where: { name } });
  if (!genre) {
    genre = await prisma.genre.create({
      data: { name, description: `${name} movies` },
    });
  }
  return genre;
}

async function getOrCreateActor(name: string) {
  let actor = await prisma.actor.findFirst({ where: { name } });
  if (!actor) {
    actor = await prisma.actor.create({ data: { name } });
  }
  return actor;
}

async function getOrCreateDirector(name: string) {
  let director = await prisma.director.findFirst({ where: { name } });
  if (!director) {
    director = await prisma.director.create({ data: { name } });
  }
  return director;
}

async function main() {
  console.log("🎬 Fetching popular movies from TMDB...");

  // Fetch popular movies (page 1 and 2)
  const moviesList: { id: number }[] = [];
  for (const page of [1, 2]) {
    const res = await fetch(
      `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
    );
    const data = await res.json();
    moviesList.push(...data.results);
  }

  console.log(`Found ${moviesList.length} movies. Fetching details...`);

  // For each movie, get full details + credits
  for (const m of moviesList.slice(0, 20)) {
    const detailsRes = await fetch(
      `${TMDB_BASE}/movie/${m.id}?api_key=${TMDB_API_KEY}`,
    );
    const details = await detailsRes.json();

    const creditsRes = await fetch(
      `${TMDB_BASE}/movie/${m.id}/credits?api_key=${TMDB_API_KEY}`,
    );
    const credits = await creditsRes.json();

    // Extract top actors and director
    const topActors = credits.cast?.slice(0, 3) ?? [];
    const director = credits.crew?.find(
      (c: { job: string; name: string }) => c.job === "Director",
    );

    // Convert names into database records
    const genreName = details.genres?.[0]?.name ?? "Unknown";
    const genre = await getOrCreateGenre(genreName);

    const actorRecords = await Promise.all(
      topActors.map((a: { name: string }) => getOrCreateActor(a.name)),
    );
    const directorRecord = director
      ? await getOrCreateDirector(director.name)
      : null;

    if (!details.poster_path || !details.release_date || !details.runtime) {
      console.log(`Skipping "${details.title}" — missing required data`);
      continue;
    }

    await prisma.movie.create({
      data: {
        title: details.title,
        description: details.overview || "No description available.",
        price: 15 + 4.99,
        releaseYear: new Date(details.release_date).getFullYear(),
        imageUrl: `${IMAGE_BASE}${details.poster_path}`,
        stock: true,
        runtime: details.runtime,
        rating: details.vote_average,
        genre: { connect: { id: genre.id } },
        actors: { connect: actorRecords.map((a) => ({ id: a.id })) },
        directors: directorRecord
          ? { connect: [{ id: directorRecord.id }] }
          : undefined,
      },
    });

    console.log(`✅ Added: ${details.title}`);
  }

  console.log("🎉 Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
