import dotenv from 'dotenv'

dotenv.config()
const BASE = 'https://api.themoviedb.org/3'
const KEY = process.env.TMDB_API_KEY

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  release_date: string
  poster_path: string | null
  backdrop_path?: string | null
  vote_average: number
  runtime?: number
  genres?: TMDBGenre[]
  tagline?: string
  popularity?: number
  budget?: number
  revenue?: number
  imdb_id?: string
  original_title?: string
}

export interface TMDBCastMember {
  id: number
  name: string
  character: string
}

export interface TMDBCrewMember {
  id: number
  name: string
  job: string
}

export interface TMDBCredits {
  cast: TMDBCastMember[]
  crew: TMDBCrewMember[]
}

export interface TMDBPopularResponse {
  page: number
  results: TMDBMovie[]
}

// NEW: Trailer / video API
export interface TMDBVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export interface TMDBVideoResponse {
  id: number
  results: TMDBVideo[]
}

// NEW: Keywords API
export interface TMDBKeyword {
  id: number
  name: string
}

export interface TMDBKeywordResponse {
  id: number
  keywords: TMDBKeyword[]
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function tmdb<T>(path: string, params: Record<string, unknown> = {}): Promise<T> {
  const url = new URL(BASE + path)

  if (!KEY) throw new Error('Missing TMDB_API_KEY in environment')
  url.searchParams.set('api_key', KEY)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  const maxRetries = 6
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url)

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get('retry-after'))
      const delayMs = retryAfter > 0 ? retryAfter * 1000 : 1000 * 2 ** attempt
      await sleep(delayMs)
      continue
    }

    if (!res.ok) {
      throw new Error(`TMDB error ${res.status}: ${await res.text()}`)
    }

    return res.json() as Promise<T>
  }

  throw new Error(`TMDB error 429: exceeded retries for ${path}`)
}

export function fetchPopularMovies(page = 1) {
  return tmdb<TMDBPopularResponse>('/movie/popular', { page })
}

export function fetchMovieDetails(id: number) {
  return tmdb<TMDBMovie>(`/movie/${id}`)
}

export function fetchMovieCredits(id: number) {
  return tmdb<TMDBCredits>(`/movie/${id}/credits`)
}

export function fetchGenres() {
  return tmdb<{ genres: TMDBGenre[] }>('/genre/movie/list')
}

// NEW
export function fetchMovieVideos(id: number) {
  return tmdb<TMDBVideoResponse>(`/movie/${id}/videos`)
}

// NEW
export function fetchMovieKeywords(id: number) {
  return tmdb<TMDBKeywordResponse>(`/movie/${id}/keywords`)
}
