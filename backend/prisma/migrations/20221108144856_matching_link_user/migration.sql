/*
  Warnings:

  - The primary key for the `Matching` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Matching` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Matching` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Matching` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Matching" DROP CONSTRAINT "Matching_pkey",
DROP COLUMN "id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Matching_userId_key" ON "Matching"("userId");

-- AddForeignKey
ALTER TABLE "Matching" ADD CONSTRAINT "Matching_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
