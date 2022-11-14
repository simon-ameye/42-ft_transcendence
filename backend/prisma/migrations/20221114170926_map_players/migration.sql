/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "players" (
    "socketId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "gameId" INTEGER,

    CONSTRAINT "players_pkey" PRIMARY KEY ("socketId")
);

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
