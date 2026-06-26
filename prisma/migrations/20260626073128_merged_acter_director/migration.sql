/*
  Warnings:

  - You are about to drop the column `genreId` on the `movies` table. All the data in the column will be lost.
  - You are about to drop the `_ActorToMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DirectorToMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `actors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `directors` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CrewRole" AS ENUM ('ACTOR', 'DIRECTOR');

-- DropForeignKey
ALTER TABLE "_ActorToMovie" DROP CONSTRAINT "_ActorToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorToMovie" DROP CONSTRAINT "_ActorToMovie_B_fkey";

-- DropForeignKey
ALTER TABLE "_DirectorToMovie" DROP CONSTRAINT "_DirectorToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_DirectorToMovie" DROP CONSTRAINT "_DirectorToMovie_B_fkey";

-- DropForeignKey
ALTER TABLE "movies" DROP CONSTRAINT "movies_genreId_fkey";

-- AlterTable
ALTER TABLE "movies" DROP COLUMN "genreId";

-- DropTable
DROP TABLE "_ActorToMovie";

-- DropTable
DROP TABLE "_DirectorToMovie";

-- DropTable
DROP TABLE "actors";

-- DropTable
DROP TABLE "directors";

-- CreateTable
CREATE TABLE "crew_members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "CrewRole" NOT NULL,

    CONSTRAINT "crew_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CrewToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CrewToMovie_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GenreToMovie" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GenreToMovie_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CrewToMovie_B_index" ON "_CrewToMovie"("B");

-- CreateIndex
CREATE INDEX "_GenreToMovie_B_index" ON "_GenreToMovie"("B");

-- AddForeignKey
ALTER TABLE "_CrewToMovie" ADD CONSTRAINT "_CrewToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "crew_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrewToMovie" ADD CONSTRAINT "_CrewToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
