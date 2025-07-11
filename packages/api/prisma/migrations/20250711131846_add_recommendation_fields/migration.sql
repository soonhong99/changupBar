-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "isBeginnerFriendly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWomanFriendly" BOOLEAN NOT NULL DEFAULT false;
