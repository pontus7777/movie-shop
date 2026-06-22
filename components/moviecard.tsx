import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type Movie = {
  id: string;
  title: string;
  description: string;
  price: number;
  releaseYear: number;
  imageUrl: string | null;
  stock: boolean;
  runtime: number;
  genreId: number | null;
  createdAt: Date;
  updatedAt: Date;
  //Maybe no need for this , but it's ok to use it in admin sites!
  genre: {
    id: number;
    name: string;
    description: string;
  } | null;
  actors: {
    id: string;
    name: string;
  }[];
  directors: {
    id: string;
    name: string;
  }[];
};

// {
//   title: string;
//   description: string;
//   price: number;
//   imageUrl: string;
//   genre: string;
// };




type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <Card className="w-72 overflow-hidden">
      {/* Movie Poster */}
      <Image
        src={movie.imageUrl ?? "/placeholder-movie.jpg"}
        alt={movie.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />

      {/* Info Section */}
      <CardHeader>
        <CardTitle>{movie.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{movie.genre?.name ?? "No genre"}</p>
      </CardHeader>

      <CardContent>
        <p className="text-sm mb-3">{movie.description}</p>

        <p className="font-bold text-lg mb-3">${movie.price.toString()}</p>

        <Button className="w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
