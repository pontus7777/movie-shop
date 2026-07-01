/*
  Warnings:

  - You are about to drop the column `role` on the `crew_members` table. All the data in the column will be lost.
  - You are about to drop the column `trailer_url` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the `_CrewToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CrewToMovie" DROP CONSTRAINT "_CrewToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_CrewToMovie" DROP CONSTRAINT "_CrewToMovie_B_fkey";

-- AlterTable
ALTER TABLE "crew_members" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "trailer_url";

-- DropTable
DROP TABLE "_CrewToMovie";

-- CreateTable
CREATE TABLE "crew_on_movie" (
    "id" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "role" "CrewRole" NOT NULL,

    CONSTRAINT "crew_on_movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crew_on_movie_crewId_movieId_role_key" ON "crew_on_movie"("crewId", "movieId", "role");

-- AddForeignKey
ALTER TABLE "crew_on_movie" ADD CONSTRAINT "crew_on_movie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_on_movie" ADD CONSTRAINT "crew_on_movie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
