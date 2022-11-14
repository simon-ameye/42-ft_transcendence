-- CreateTable
CREATE TABLE "Player" (
    "socketId" TEXT NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,
    "gameId" INTEGER,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("socketId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
