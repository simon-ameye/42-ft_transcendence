/*
  Warnings:

  - You are about to drop the `Matching` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Matching" DROP CONSTRAINT "Matching_userId_fkey";

-- DropTable
DROP TABLE "Matching";

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "matchingQueue" INTEGER[],

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);
