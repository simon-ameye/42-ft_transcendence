-- CreateEnum
CREATE TYPE "ChannelMode" AS ENUM ('PUBLIC', 'DIRECT', 'PRIVATE');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "hash" TEXT,
    "displayName" TEXT,
    "imageUrl" TEXT,
    "googleSecret" TEXT,
    "socketId" TEXT,
    "blockedUserIds" INTEGER[],
    "friends" INTEGER[],

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_socketId_key" ON "users"("socketId");
