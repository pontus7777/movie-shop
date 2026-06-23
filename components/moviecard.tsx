import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export type Movie = {
  id: string
  title: string
  description: string
  price: number
  releaseYear: number
  imageUrl: string | null
  stock: boolean
  runtime: number
  genreId: number | null
  createdAt: Date
  updatedAt: Date
  /*** All relations in */
  genre: {
    id: number
    name: string
    description: string
  } | null
  actors: {
    id: string
    name: string
  }[]
  directors: {
    id: string
    name: string
  }[]
}

// {
//   title: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   genre: string;
// };

type Props = {
  movie: Movie
}

export default function MovieCard({ movie }: Props) {
  return (
    <Card className="w-72 overflow-hidden">
      {/* Movie Poster */}
      <Image
        src={movie.imageUrl ?? '/placeholder-movie.jpg'}
        alt={movie.title}
        width={300}
        height={200}
        className="h-48 w-full object-cover"
      />

      {/* Info Section */}
      <CardHeader>
        <CardTitle>
          <Link href={`/admin/movies/${movie.id}`} className="font-semibold hover:underline">
            {movie.title}
          </Link>
        </CardTitle>
        <p className="text-muted-foreground text-sm">{movie.genre?.name ?? 'No genre'}</p>
      </CardHeader>

      <CardContent>
        <p className="mb-3 text-sm">{movie.description}</p>

        <p className="mb-3 text-lg font-bold">${movie.price.toString()}</p>

        <Button className="w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  )
}
