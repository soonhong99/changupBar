-- CreateEnum
CREATE TYPE "Region" AS ENUM ('METROPOLITAN', 'NON_METROPOLITAN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CAFE_BAKERY', 'RESTAURANT_BAR', 'RETAIL_ETC');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "region" "Region" NOT NULL,
    "category" "Category" NOT NULL,
    "deposit" INTEGER NOT NULL,
    "monthlyRent" INTEGER NOT NULL,
    "keyMoney" INTEGER NOT NULL,
    "monthlyRevenue" INTEGER NOT NULL,
    "materialCost" INTEGER NOT NULL,
    "personnelCost" INTEGER NOT NULL,
    "netProfit" INTEGER NOT NULL,
    "isAutomated" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "isFirstFloor" BOOLEAN NOT NULL DEFAULT false,
    "isNearStation" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "imageUrls" TEXT[],
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "isBest" BOOLEAN NOT NULL DEFAULT false,
    "bestUntil" TIMESTAMP(3),

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
