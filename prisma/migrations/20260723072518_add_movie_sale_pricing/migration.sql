-- AlterTable
ALTER TABLE "movies" ADD COLUMN     "saleEndsAt" TIMESTAMP(3),
ADD COLUMN     "salePriceInCents" INTEGER,
ADD COLUMN     "saleStartsAt" TIMESTAMP(3);
