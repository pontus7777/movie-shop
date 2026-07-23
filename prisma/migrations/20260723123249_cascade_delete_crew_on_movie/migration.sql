-- DropForeignKey
ALTER TABLE "crew_on_movie" DROP CONSTRAINT "crew_on_movie_movieId_fkey";

-- AddForeignKey
ALTER TABLE "crew_on_movie" ADD CONSTRAINT "crew_on_movie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
