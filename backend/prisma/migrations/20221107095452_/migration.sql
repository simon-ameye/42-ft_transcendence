-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
<<<<<<<< HEAD:backend/prisma/migrations/20221108104004_/migration.sql
    "hash" TEXT,
    "displayName" TEXT,
    "imageUrl" TEXT,
    "googleSecret" TEXT,
========
    "hash" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "imageUrl" TEXT,
>>>>>>>> 509265d4162a54370798ff4a25f8e4c3cddf50a8:backend/prisma/migrations/20221107095452_/migration.sql

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
