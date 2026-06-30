// app/(shop)/movies/page.tsx
import prisma from '@/lib/prisma'
import ShopMovieCard, { MovieWithRelations } from '../_components/shop-movie-card'
import { MoviesPagination } from './_components/movies-pagination'
import { getCart } from '@/lib/cart'

export default async function MoviesPage(props: PageProps<'/movies'>) {
  const params = await props.searchParams
  const pageSize = 12

  const page = Number(params.page) || 1

  const skip = (page - 1) * pageSize

  const movies = (await prisma.movie.findMany({
    where: { stock: true },
    orderBy: { popularity: 'desc' },
    skip,
    take: pageSize,
    include: {
      genres: true,
      keywords: true,
      credits: {
        include: { crew: true },
      },
    },
  })) as MovieWithRelations[]

  const total = await prisma.movie.count({
    where: { stock: true },
  })

  const totalPages = Math.ceil(total / pageSize)

  const cart = await getCart()

  return (
    <div className="min-h-lvh space-y-4 p-6">
      <h1 className="text-2xl font-bold">Movies</h1>

      <div className="flex justify-center">
        <div className="grid w-full max-w-5xl grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {movies.map((movie) => {
            const quantity = cart[movie.id] ?? 0

            return <ShopMovieCard key={movie.id} movie={movie} quantity={quantity} />
          })}
        </div>
      </div>

      <MoviesPagination page={page} totalPages={totalPages} />
    </div>
  )
}
