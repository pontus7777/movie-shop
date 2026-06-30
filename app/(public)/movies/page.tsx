'use client'

import { useState } from 'react'


import { MoviesPagination } from './_components/movies-pagination'
import ShopMovieCard from '../_components/shop-movie-card'


// This is currently being a client side pagination, can change it to server component with data in the db (Pontus)

export default function MoviesPage({}) {
  const [page, setPage] = useState(1)
  const pageSize = 12

  const totalPages = Math.ceil(movies.length / pageSize)

  const paginatedMovies = movies.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="min-h-lvh space-y-6 p-6">
      <h1 className="text-3xl font-bold">Movies</h1>

      {/* Movie Grid */}
      <div className="flex justify-center">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-4 md:grid-cols-3">
          {paginatedMovies.map((movie) => (
            <ShopMovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>

      <MoviesPagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  )
}
