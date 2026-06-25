/*
  Warnings:

  - A unique constraint covering the columns `[cartId,movieId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId,movieId]` on the table `order_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "rating" DOUBLE PRECISION;