/*
  Warnings:

  - You are about to drop the column `points` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "points",
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;
