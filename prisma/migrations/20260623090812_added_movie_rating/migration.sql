/*
  Warnings:

  - You are about to drop the column `cartId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,movieId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,movieId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rating` to the `movies` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "cart_items_cartId_key";

-- DropIndex
DROP INDEX "cart_items_movieId_key";

-- DropIndex
DROP INDEX "order_items_movieId_key";

-- DropIndex
DROP INDEX "order_items_orderId_key";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "cartId",
ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "role" TEXT DEFAULT 'user';

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_movieId_key" ON "cart_items"("cartId", "movieId");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_movieId_key" ON "order_items"("orderId", "movieId");
