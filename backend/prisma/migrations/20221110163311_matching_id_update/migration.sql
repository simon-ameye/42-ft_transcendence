/*
  Warnings:

  - You are about to drop the column `userId` on the `Matching` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Matching" DROP CONSTRAINT "Matching_userId_fkey";

-- DropIndex
DROP INDEX "Matching_userId_key";

-- AlterTable
ALTER TABLE "Matching" DROP COLUMN "userId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Matching_pkey" PRIMARY KEY ("id");
