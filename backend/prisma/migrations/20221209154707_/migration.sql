-- CreateEnum
CREATE TYPE "ChannelMode" AS ENUM ('PUBLIC', 'DIRECT', 'PRIVATE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT,
    "displayName" TEXT NOT NULL,
    "imageUrl" TEXT,
    "googleSecret" TEXT,
    "socketId" TEXT,
    "blockedUserIds" INTEGER[],
    "friends" INTEGER[],
    "inGame" BOOLEAN NOT NULL DEFAULT false,
    "victories" INTEGER NOT NULL DEFAULT 0,
    "log" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'unknown channel',
    "mode" "ChannelMode" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT NOT NULL DEFAULT '',
    "ownerId" INTEGER NOT NULL DEFAULT 0,
    "adminIds" INTEGER[],
    "banedUserIds" INTEGER[],
    "messageIds" INTEGER[],
    "userIds" INTEGER[],
    "muteUserIds" INTEGER[],
    "muteRelease" TIMESTAMP(3)[],

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "authorId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matching" (
    "userId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Player" (
    "userId" INTEGER NOT NULL,
    "displayName" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "gameId" INTEGER,
    "side" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_displayName_key" ON "users"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "users_socketId_key" ON "users"("socketId");

-- CreateIndex
CREATE UNIQUE INDEX "Matching_userId_key" ON "Matching"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");

-- AddForeignKey
ALTER TABLE "Matching" ADD CONSTRAINT "Matching_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE SET NULL ON UPDATE CASCADE;
