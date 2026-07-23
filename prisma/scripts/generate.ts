// prisma/scripts/generate.ts
import dotenv from 'dotenv'
import { writeFileSync } from 'fs'
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

async function generate() {
  console.log('Fetching genres...')
  const genreResponse = await fetchGenres()
  const genres = genreResponse.genres

  console.log('Fetching movies (5 pages = ~100 movies)...')
  const pages = await Promise.all([
    fetchPopularMovies(1),
    fetchPopularMovies(2),
    fetchPopularMovies(3),
    fetchPopularMovies(4),
    fetchPopularMovies(5),
  ])

  const movies: TMDBMovie[] = pages.flatMap((p) => p.results)
  const selectedMovies = movies.slice(0, 100)

  const fullMovies = []

  for (const m of selectedMovies) {
    const details = await fetchMovieDetails(m.id)
    const credits = await fetchMovieCredits(m.id)
    const videos = await fetchMovieVideos(m.id)
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

    // Trailer (YouTube official trailer)
    const trailer =
      videos.results.find(
        (v) =>
          v.type === 'Trailer' &&
          v.site === 'YouTube' &&
          (v.official || v.name.toLowerCase().includes('trailer')),
      ) ?? null

    const trailerUrl = trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null

    // Backdrop
    const backdropUrl = details.backdrop_path
      ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
      : null

    // Keywords
    const keywordResponse = await fetchMovieKeywords(m.id)

    const keywords = Array.isArray(keywordResponse.keywords)
      ? keywordResponse.keywords.map((k) => ({
          id: k.id,
          name: k.name,
        }))
      : []

    fullMovies.push({
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
    })
  }

  writeFileSync('tmdb-data.json', JSON.stringify({ genres, movies: fullMovies }, null, 2))

  console.log('Generated tmdb-data.json with 50 movies')
}

generate()
