import MovieCard, { Movie } from "@/components/moviecard";

const movie: Movie = {
  title: "Movie",
  description: "test",
  genre: "action",
  imageUrl: "https://picsum.photos/200/300",
  price: 4561,
};

export default function TestPage() {
  return (
    <div>
      <MovieCard movie={movie} />
    </div>
  );
}
