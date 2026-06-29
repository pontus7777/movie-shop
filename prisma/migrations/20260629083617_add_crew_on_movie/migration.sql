/*
  Warnings:

  - You are about to drop the column `role` on the `crew_members` table. All the data in the column will be lost.
  - You are about to drop the `_CrewToMovie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CrewToMovie" DROP CONSTRAINT "_CrewToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "_CrewToMovie" DROP CONSTRAINT "_CrewToMovie_B_fkey";

-- AlterTable
ALTER TABLE "crew_members" DROP COLUMN "role",
ADD COLUMN     "movieId" TEXT;

-- DropTable
DROP TABLE "_CrewToMovie";

-- CreateTable
CREATE TABLE "CrewOnMovie" (
    "id" TEXT NOT NULL,
    "crewId" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "role" "CrewRole" NOT NULL,

    CONSTRAINT "CrewOnMovie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CrewOnMovie_crewId_movieId_role_key" ON "CrewOnMovie"("crewId", "movieId", "role");

-- AddForeignKey
ALTER TABLE "crew_members" ADD CONSTRAINT "crew_members_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewOnMovie" ADD CONSTRAINT "CrewOnMovie_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "crew_members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewOnMovie" ADD CONSTRAINT "CrewOnMovie_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
