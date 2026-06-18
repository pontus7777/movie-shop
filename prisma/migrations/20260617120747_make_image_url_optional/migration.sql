/*
  Warnings:

  - You are about to alter the column `price` on the `movies` table. The data in that column could be lost. The data in that column will be cast from `Money` to `Decimal(65,30)`.
  - You are about to alter the column `price` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `total` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - A unique constraint covering the columns `[cartId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[movieId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movies" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_key" ON "cart_items"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_movieId_key" ON "cart_items"("movieId");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_key" ON "order_items"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_movieId_key" ON "order_items"("movieId");
