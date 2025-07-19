-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('AVAILABLE', 'PENDING', 'SOLD');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "contractStatus" "ContractStatus" NOT NULL DEFAULT 'AVAILABLE';
