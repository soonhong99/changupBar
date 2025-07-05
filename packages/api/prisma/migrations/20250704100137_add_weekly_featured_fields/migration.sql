-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "featuredEnd" TIMESTAMP(3),
ADD COLUMN     "featuredStart" TIMESTAMP(3),
ADD COLUMN     "isWeeklyBest" BOOLEAN NOT NULL DEFAULT false;
