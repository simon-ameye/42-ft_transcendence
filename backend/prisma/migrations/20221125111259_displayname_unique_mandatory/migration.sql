/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `displayName` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "displayName" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_displayName_key" ON "users"("displayName");
