/*
  Warnings:

  - You are about to drop the column `hasParking` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `isFirstFloor` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "hasParking",
DROP COLUMN "isFirstFloor",
ADD COLUMN     "isGoodDeal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSpecialDistrict" BOOLEAN NOT NULL DEFAULT false;
