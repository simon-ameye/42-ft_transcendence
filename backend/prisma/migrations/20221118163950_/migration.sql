/*
  Warnings:

  - You are about to drop the column `status` on the `friendRequest` table. All the data in the column will be lost.
  - Added the required column `fstatus` to the `friendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "fstatus" AS ENUM ('pending', 'accepted', 'declined', 'blocked');

-- AlterTable
ALTER TABLE "friendRequest" DROP COLUMN "status",
ADD COLUMN     "fstatus" TEXT NOT NULL;
