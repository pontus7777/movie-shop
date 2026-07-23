-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_movieId_fkey";

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
