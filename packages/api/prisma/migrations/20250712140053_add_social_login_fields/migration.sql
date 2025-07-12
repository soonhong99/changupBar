/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('LOCAL', 'KAKAO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" "Provider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN     "providerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_providerId_key" ON "User"("providerId");
