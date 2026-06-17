/*
  Warnings:

  - You are about to drop the `_ActorToMovie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DirectorToMovie` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `movies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stock` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ActorToMovie" DROP CONSTRAINT "_ActorToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActorToMovie" DROP CONSTRAINT "_ActorToMovie_B_fkey";

-- DropForeignKey
ALTER TABLE "_DirectorToMovie" DROP CONSTRAINT "_DirectorToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_DirectorToMovie" DROP CONSTRAINT "_DirectorToMovie_B_fkey";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "genreId" INTEGER,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "runtime" INTEGER NOT NULL,
ADD COLUMN     "stock" BOOLEAN NOT NULL;

-- DropTable
DROP TABLE "_ActorToMovie";

-- DropTable
DROP TABLE "_DirectorToMovie";

-- CreateTable
CREATE TABLE "genres" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieActors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieActors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MovieDirectors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieDirectors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MovieActors_B_index" ON "_MovieActors"("B");

-- CreateIndex
CREATE INDEX "_MovieDirectors_B_index" ON "_MovieDirectors"("B");

-- AddForeignKey
ALTER TABLE "movies" ADD CONSTRAINT "movies_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genres"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieActors" ADD CONSTRAINT "_MovieActors_A_fkey" FOREIGN KEY ("A") REFERENCES "actors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieActors" ADD CONSTRAINT "_MovieActors_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieDirectors" ADD CONSTRAINT "_MovieDirectors_A_fkey" FOREIGN KEY ("A") REFERENCES "directors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieDirectors" ADD CONSTRAINT "_MovieDirectors_B_fkey" FOREIGN KEY ("B") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
