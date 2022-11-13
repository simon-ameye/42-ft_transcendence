/*
  Warnings:

  - Added the required column `countWin` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "countWin" INTEGER NOT NULL,
ADD COLUMN     "friends" INTEGER[],
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "relationShip" (
    "id" SERIAL NOT NULL,
    "RequesterId" INTEGER NOT NULL,
    "AddresseeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "relationShip_pkey" PRIMARY KEY ("id")
);
