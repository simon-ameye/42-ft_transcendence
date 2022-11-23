/*
  Warnings:

  - You are about to drop the column `gameId` on the `Matching` table. All the data in the column will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Matching" DROP CONSTRAINT "Matching_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- AlterTable
ALTER TABLE "Matching" DROP COLUMN "gameId";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gameId" INTEGER,
ADD COLUMN     "inGame" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "victories" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Player";

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
