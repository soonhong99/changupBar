/*
  Warnings:

  - You are about to drop the column `address` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "address",
ADD COLUMN     "detailAddress" TEXT,
ADD COLUMN     "eupmyeondong" TEXT,
ADD COLUMN     "roadAddress" TEXT,
ADD COLUMN     "sido" TEXT,
ADD COLUMN     "sigungu" TEXT;
