/*
  Warnings:

  - You are about to drop the column `cartId` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cartId,movieId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,movieId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_userId_fkey";

-- DropIndex
DROP INDEX "cart_items_cartId_key";

-- DropIndex
DROP INDEX "cart_items_movieId_key";

-- DropIndex
DROP INDEX "order_items_movieId_key";

-- DropIndex
DROP INDEX "order_items_orderId_key";

-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

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

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
