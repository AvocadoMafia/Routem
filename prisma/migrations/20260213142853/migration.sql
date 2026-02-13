/*
  Warnings:

  - The values [public,private] on the enum `RouteVisibility` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bio` on the `Route` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Route` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `Route` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the `RouteSegment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RouteSpot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SegmentStep` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,routeId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransitMode" AS ENUM ('WALK', 'TRAIN', 'BUS', 'CAR', 'BIKE', 'FLIGHT', 'SHIP', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "RouteVisibility_new" AS ENUM ('PUBLIC', 'PRIVATE');
ALTER TABLE "public"."Route" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "Route" ALTER COLUMN "visibility" TYPE "RouteVisibility_new" USING ("visibility"::text::"RouteVisibility_new");
ALTER TYPE "RouteVisibility" RENAME TO "RouteVisibility_old";
ALTER TYPE "RouteVisibility_new" RENAME TO "RouteVisibility";
DROP TYPE "public"."RouteVisibility_old";
ALTER TABLE "Route" ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';
COMMIT;

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_routeId_fkey";

-- DropForeignKey
ALTER TABLE "RouteNode" DROP CONSTRAINT "RouteNode_routeId_fkey";

-- DropForeignKey
ALTER TABLE "RouteSegment" DROP CONSTRAINT "RouteSegment_fromNodeId_fkey";

-- DropForeignKey
ALTER TABLE "RouteSegment" DROP CONSTRAINT "RouteSegment_spotId_fkey";

-- DropForeignKey
ALTER TABLE "RouteSegment" DROP CONSTRAINT "RouteSegment_toNodeId_fkey";

-- DropForeignKey
ALTER TABLE "RouteSpot" DROP CONSTRAINT "RouteSpot_routeId_fkey";

-- DropForeignKey
ALTER TABLE "RouteSpot" DROP CONSTRAINT "RouteSpot_spotId_fkey";

-- DropForeignKey
ALTER TABLE "SegmentStep" DROP CONSTRAINT "SegmentStep_segmentId_fkey";

-- DropForeignKey
ALTER TABLE "View" DROP CONSTRAINT "View_routeId_fkey";

-- AlterTable
ALTER TABLE "Route" DROP COLUMN "bio",
DROP COLUMN "category",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "visibility" SET DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "RouteNode" ALTER COLUMN "details" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" TEXT;

-- DropTable
DROP TABLE "RouteSegment";

-- DropTable
DROP TABLE "RouteSpot";

-- DropTable
DROP TABLE "SegmentStep";

-- DropEnum
DROP TYPE "TransportMode";

-- CreateTable
CREATE TABLE "TransitStep" (
    "id" TEXT NOT NULL,
    "mode" "TransitMode" NOT NULL,
    "duration" INTEGER,
    "distance" DOUBLE PRECISION,
    "memo" TEXT,
    "routeNodeId" TEXT NOT NULL,

    CONSTRAINT "TransitStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_routeId_key" ON "Like"("userId", "routeId");

-- CreateIndex
CREATE INDEX "Route_authorId_idx" ON "Route"("authorId");

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteNode" ADD CONSTRAINT "RouteNode_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransitStep" ADD CONSTRAINT "TransitStep_routeNodeId_fkey" FOREIGN KEY ("routeNodeId") REFERENCES "RouteNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "View" ADD CONSTRAINT "View_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
