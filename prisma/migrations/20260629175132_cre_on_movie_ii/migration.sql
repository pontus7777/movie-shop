/*
  Warnings:

  - You are about to drop the column `role` on the `crew_members` table. All the data in the column will be lost.
  - You are about to alter the column `total` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to drop the `_CrewToMovie` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `crew_members` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentMethod` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'PAYPAL', 'SWISH');

-- DropForeignKey
ALTER TABLE "_CrewToMovie" DROP CONSTRAINT "_CrewToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_CrewToMovie" DROP CONSTRAINT "_CrewToMovie_B_fkey";

-- AlterTable
ALTER TABLE "crew_members" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL,
ALTER COLUMN "total" SET DATA TYPE INTEGER;

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

-- CreateIndex
CREATE UNIQUE INDEX "crew_members_name_key" ON "crew_members"("name");

-- AddForeignKey
ALTER TABLE "crew_on_movie" ADD CONSTRAINT "crew_on_movie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crew_on_movie" ADD CONSTRAINT "crew_on_movie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
