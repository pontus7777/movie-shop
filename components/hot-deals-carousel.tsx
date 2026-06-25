"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie, Genre } from "@/generated/prisma/client";

type MovieWithGenre = Omit<Movie, "price"> & {
  price: number;
  genre: Genre | null;
};

export default function HotDealsCarousel({
  movies,
}: {
  movies: MovieWithGenre[];
}) {
  const [index, setIndex] = useState(0);

  if (movies.length === 0) return null;

  const movie = movies[index];

  const next = () => setIndex((prev) => (prev + 1) % movies.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + movies.length) % movies.length);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      <Link href={`/movies/${movie.id}`}>
        <div className="relative w-full h-55 md:h-70">
          <Image
            src={movie.imageUrl ?? "/placeholder.jpg"}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            loading="eager"
            className="object-cover transition-opacity duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

          <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-md">
            €{movie.price} ONLY
          </div>

          <div className="absolute bottom-0 left-0 p-6 text-white max-w-md">
            <h3 className="text-2xl font-bold mb-1">{movie.title}</h3>
            <p className="text-sm text-gray-300">
              {movie.genre?.name} • ⭐{" "}
              {movie.rating ? movie.rating.toFixed(1) : "—"}
            </p>
          </div>
        </div>
      </Link>

      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-600 text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-purple-600 text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
