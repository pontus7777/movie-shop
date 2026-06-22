import { HomeCarousel } from "@/components/home-carousel";
import { Movie } from "@/generated/prisma/client";

type Movies = Pick<Movie, "id" | "title" | "imageUrl">[];

const movies: Movies = [
  { id: "1", title: "Title 1", imageUrl: "https://picsum.photos/200/300" },
  { id: "2", title: "Title 2", imageUrl: "https://picsum.photos/200/300" },
  { id: "3", title: "Title 3", imageUrl: "https://picsum.photos/200/300" },
  { id: "4", title: "Title 4", imageUrl: "https://picsum.photos/200/300" },
  { id: "5", title: "Title 5", imageUrl: "https://picsum.photos/200/300" },
  { id: "6", title: "Title 6", imageUrl: "https://picsum.photos/200/300" },
  { id: "7", title: "Title 7", imageUrl: "https://picsum.photos/200/300" },
  { id: "8", title: "Title 8", imageUrl: "https://picsum.photos/200/300" },
];
export default function Home() {
  return (
    <div>
      <main>
        <h1 className="mx-auto text-4xl font-bold">READY!</h1>

        <HomeCarousel movies={movies} />
      </main>
    </div>
  );
}
