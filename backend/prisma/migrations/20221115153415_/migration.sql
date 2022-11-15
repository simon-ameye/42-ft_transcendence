-- CreateEnum
CREATE TYPE "ChannelMode" AS ENUM ('PUBLIC', 'DIRECT', 'PRIVATE', 'PROTECTED');

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

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Channel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mode" "ChannelMode" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "ownerId" INTEGER,
    "adminIds" INTEGER[],
    "banedUserIds" INTEGER[],
    "banedRelease" TIMESTAMP(3)[],
    "messageIds" INTEGER[],
    "userIds" INTEGER[],

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "author" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
