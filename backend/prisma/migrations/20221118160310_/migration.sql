/*
  Warnings:

  - You are about to drop the column `clientId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `friendId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `friendShip` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_friendId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "clientId",
DROP COLUMN "friendId";

-- DropTable
DROP TABLE "friendShip";

-- CreateTable
CREATE TABLE "friendRequest" (
    "id" SERIAL NOT NULL,
    "creatorId" INTEGER,
    "receiverId" INTEGER,

    CONSTRAINT "friendRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "friendRequest" ADD CONSTRAINT "friendRequest_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "friendRequest" ADD CONSTRAINT "friendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
