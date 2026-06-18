import MovieCard, { Movie } from "@/components/moviecard";

const movie: Movie = {
  title: "Batman",
  description: "A superhero action movie",
  genre: "action",
  imageUrl: "https://picsum.photos/200/300",
  price: 20,
};

export default function TestPage() {
  return (
    <div>
      <MovieCard movie={movie} />
    </div>
  );
}
