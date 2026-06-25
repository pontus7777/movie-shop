import Image from "next/image";
import Link from "next/link";
import type { Movie } from "@/generated/prisma/client";

type MovieWithGenre = Movie & {
  genre: {
    name: string;
  } | null;
};

export default function MovieCard({
  movie,
  showDealBadge = false,
}: {
  movie: MovieWithGenre;
  showDealBadge?: boolean;
}) {
  if (!movie.imageUrl) {
    return null;
  }

  return (
    <Link href={`/movies/${movie.id}`}>
      <div className="group relative rounded-xl overflow-hidden cursor-pointer bg-muted">
        {showDealBadge && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md">
            €{movie.price.toString()} ONLY
          </div>
        )}

        <Image
          src={movie.imageUrl}
          alt={movie.title}
          width={300}
          height={400}
          className="h-[340px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="p-2">
          <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
          <p className="text-xs text-muted-foreground">
            ⭐ {movie.rating ? movie.rating.toFixed(1) : "Not rated"}
          </p>
        </div>
      </div>
    </Link>
  );
}
