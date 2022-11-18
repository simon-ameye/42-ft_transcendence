/*
  Warnings:

  - Added the required column `status` to the `friendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "friendRequest" ADD COLUMN     "status" TEXT NOT NULL;
