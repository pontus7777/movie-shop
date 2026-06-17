import Image from "next/image";

export type Movie = {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  genre: string;
};

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <div className="rounded-xl border border-gray-200 shadow-md overflow-hidden w-64">
      {/* Movie Poster */}
      <Image
        src={movie.imageUrl}
        alt={movie.title}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />

      {/* Info Section */}
      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">{movie.title}</h2>
        <span className="text-sm text-gray-500">{movie.genre}</span>
        <p className="text-sm text-gray-600 line-clamp-2">
          {movie.description}
        </p>
        <p className="text-green-600 font-semibold">${movie.price}</p>
        <button className="mt-2 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
