/*
  Warnings:

  - You are about to drop the column `price` on the `movies` table. All the data in the column will be lost.
  - Added the required column `priceInCents` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "movies" DROP COLUMN "price",
ADD COLUMN     "adult" BOOLEAN DEFAULT false,
ADD COLUMN     "backdropUrl" TEXT,
ADD COLUMN     "budget" INTEGER,
ADD COLUMN     "imdbId" TEXT,
ADD COLUMN     "originalTitle" TEXT,
ADD COLUMN     "popularity" DOUBLE PRECISION,
ADD COLUMN     "priceInCents" INTEGER NOT NULL,
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "revenue" INTEGER,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "trailerUrl" TEXT;

-- CreateTable
CREATE TABLE "movie_keywords" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "movie_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieKeywords" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MovieKeywords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieKeywords_B_index" ON "_MovieKeywords"("B");

-- AddForeignKey
ALTER TABLE "_MovieKeywords" ADD CONSTRAINT "_MovieKeywords_A_fkey" FOREIGN KEY ("A") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieKeywords" ADD CONSTRAINT "_MovieKeywords_B_fkey" FOREIGN KEY ("B") REFERENCES "movie_keywords"("id") ON DELETE CASCADE ON UPDATE CASCADE;
