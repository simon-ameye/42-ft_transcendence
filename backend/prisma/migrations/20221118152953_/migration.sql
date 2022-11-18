/*
  Warnings:

  - You are about to drop the column `friends` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `relationShip` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `friendId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "friends",
ADD COLUMN     "friendId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "relationShip";

-- CreateTable
CREATE TABLE "friendShip" (
    "id" SERIAL NOT NULL,
    "RequesterId" INTEGER NOT NULL,
    "AddresseeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "friendShip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "friendShip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
