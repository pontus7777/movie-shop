/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `wishList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "wishList" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shareId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "wishList_shareId_key" ON "wishList"("shareId");
