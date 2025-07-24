/*
  Warnings:

  - You are about to drop the column `category` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "category",
ADD COLUMN     "mainCategory" TEXT,
ADD COLUMN     "subCategory" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- DropEnum
DROP TYPE "Category";
