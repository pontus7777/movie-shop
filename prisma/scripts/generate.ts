// prisma/scripts/generate.ts
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
import path from 'path'
import {
  fetchPopularMovies,
  fetchMovieDetails,
  fetchMovieCredits,
  fetchGenres,
  fetchMovieVideos,
  fetchMovieKeywords,
  TMDBGenre,
  TMDBMovie,
  TMDBCastMember,
  TMDBCrewMember,
} from './tmdb'

dotenv.config()

const TARGET_MOVIE_COUNT = 1000
const MOVIES_PER_PAGE = 20
const PAGE_COUNT = Math.ceil(TARGET_MOVIE_COUNT / MOVIES_PER_PAGE)
const CONCURRENCY = 6

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0

  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await fn(items[index], index)
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

async function generate() {
  console.log('Fetching genres...')
  const genreResponse = await fetchGenres()
  const genres = genreResponse.genres

  console.log(`Fetching movies (${PAGE_COUNT} pages = ~${PAGE_COUNT * MOVIES_PER_PAGE} movies)...`)
  const pageNumbers = Array.from({ length: PAGE_COUNT }, (_, i) => i + 1)
  const pages = await mapWithConcurrency(pageNumbers, CONCURRENCY, (page) => fetchPopularMovies(page))

  const seen = new Set<number>()
  const movies: TMDBMovie[] = pages
    .flatMap((p) => p.results)
    .filter((m) => {
      if (seen.has(m.id)) return false
      seen.add(m.id)
      return true
    })

  const selectedMovies = movies.slice(0, TARGET_MOVIE_COUNT)

  let completed = 0
  const fullMovies = await mapWithConcurrency(selectedMovies, CONCURRENCY, async (m) => {
    const [details, credits, videos, keywordResponse] = await Promise.all([
      fetchMovieDetails(m.id),
      fetchMovieCredits(m.id),
      fetchMovieVideos(m.id),
      fetchMovieKeywords(m.id),
    ])

    const releaseYear = Number(details.release_date?.slice(0, 4) ?? 2000)
    const movieGenres = details.genres?.map((g: TMDBGenre) => g.id) ?? []

    const castCredits = credits.cast.slice(0, 5).map((c: TMDBCastMember) => ({
      id: c.id.toString(),
      name: c.name,
      role: 'ACTOR' as const,
    }))

    const directorCredits = credits.crew
      .filter((c: TMDBCrewMember) => c.job === 'Director')
      .slice(0, 1)
      .map((d: TMDBCrewMember) => ({
        id: d.id.toString(),
        name: d.name,
        role: 'DIRECTOR' as const,
      }))

    const trailer =
      videos.results.find(
        (v) =>
          v.type === 'Trailer' &&
          v.site === 'YouTube' &&
          (v.official || v.name.toLowerCase().includes('trailer')),
      ) ?? null

    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null

    const backdropUrl = details.backdrop_path
      ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
      : null

    const keywords = Array.isArray(keywordResponse.keywords)
      ? keywordResponse.keywords.map((k) => ({
          id: k.id,
          name: k.name,
        }))
      : []

    completed++
    if (completed % 50 === 0 || completed === selectedMovies.length) {
      console.log(`  ${completed}/${selectedMovies.length} movies processed`)
    }

    return {
      id: m.id.toString(),
      title: m.title,
      originalTitle: details.original_title ?? null,
      description: details.overview,
      tagline: details.tagline ?? null,
      priceInCents: Math.floor(Math.random() * 1500) + 999,
      releaseYear,
      releaseDate: details.release_date ?? null,
      imageUrl: details.poster_path
        ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
        : null,
      backdropUrl,
      trailerUrl,
      imdbId: details.imdb_id ?? null,
      stock: true,
      runtime: details.runtime ?? 90,

      imdbRating: details.vote_average ?? null,

      popularity: details.popularity ?? null,
      budget: details.budget ?? null,
      revenue: details.revenue ?? null,
      genres: movieGenres,
      credits: [...castCredits, ...directorCredits],
      keywords,
    }
  })

  const outPath = path.join(__dirname, '..', 'tmdb-data.json')
  writeFileSync(outPath, JSON.stringify({ genres, movies: fullMovies }, null, 2))

  console.log(`Generated ${outPath} with ${fullMovies.length} movies`)
}

generate()
