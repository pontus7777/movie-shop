import { Movie } from '@/generated/prisma/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import Image from 'next/image';

type Props = {
  movies: Pick<Movie, 'id' | 'title' | 'imageUrl'>[];
};

function HomeCarousel({ movies }: Props) {
  return (
    <Carousel
      opts={{ align: 'start', dragFree: true }}
      className="relative w-full max-w-7xl mx-auto px-8 min-h-80"
    >
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem
            key={movie.id}
            className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
          >
            <div className="p-1">
              <Image
                loading="eager"
                width={200}
                height={300}
                src={movie.imageUrl}
                alt={movie.title}
                className="w-full h-auto rounded-md"
              />
              <p className="mt-2 font-medium text-center">{movie.title}</p>
              {/* <MovieCard movie={movie} /> */}
              {/* Want to use moviecard here possibly, issues with types */}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

export { HomeCarousel };
