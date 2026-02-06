/*
  Warnings:

  - Added the required column `authorId` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bio` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `RouteNode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `details` to the `SegmentStep` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('USER_PROFILE', 'ROUTE_THUMBNAIL', 'NODE_IMAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "ImageStatus" AS ENUM ('ADOPTED', 'DRAFT', 'UNUSED');

-- CreateEnum
CREATE TYPE "RouteVisibility" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "bio" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "visibility" "RouteVisibility" NOT NULL DEFAULT 'private';

-- AlterTable
ALTER TABLE "RouteNode" ADD COLUMN     "details" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RouteSegment" ADD COLUMN     "spotId" TEXT;

-- AlterTable
ALTER TABLE "SegmentStep" ADD COLUMN     "details" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT;

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" "ImageStatus" NOT NULL DEFAULT 'DRAFT',
    "type" "ImageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploaderId" TEXT,
    "routeNodeId" TEXT,
    "userProfileId" TEXT,
    "routeThumbId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_userProfileId_key" ON "Image"("userProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "Image_routeThumbId_key" ON "Image"("routeThumbId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_routeNodeId_fkey" FOREIGN KEY ("routeNodeId") REFERENCES "RouteNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_routeThumbId_fkey" FOREIGN KEY ("routeThumbId") REFERENCES "Route"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteSegment" ADD CONSTRAINT "RouteSegment_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
