-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('WALK', 'TRAIN', 'BUS', 'CAR', 'BIKE');

-- CreateTable
CREATE TABLE "Spot" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "Spot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteSpot" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "routeId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "RouteSpot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteNode" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "routeId" TEXT NOT NULL,
    "spotId" TEXT NOT NULL,

    CONSTRAINT "RouteNode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteSegment" (
    "id" TEXT NOT NULL,
    "fromNodeId" TEXT NOT NULL,
    "toNodeId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,

    CONSTRAINT "RouteSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SegmentStep" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "segmentId" TEXT NOT NULL,
    "mode" "TransportMode" NOT NULL,
    "duration" INTEGER,
    "distance" DOUBLE PRECISION,

    CONSTRAINT "SegmentStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RouteSpot_routeId_order_key" ON "RouteSpot"("routeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "RouteNode_routeId_order_key" ON "RouteNode"("routeId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "RouteSegment_fromNodeId_key" ON "RouteSegment"("fromNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "RouteSegment_toNodeId_key" ON "RouteSegment"("toNodeId");

-- AddForeignKey
ALTER TABLE "RouteSpot" ADD CONSTRAINT "RouteSpot_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteSpot" ADD CONSTRAINT "RouteSpot_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteNode" ADD CONSTRAINT "RouteNode_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteNode" ADD CONSTRAINT "RouteNode_spotId_fkey" FOREIGN KEY ("spotId") REFERENCES "Spot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteSegment" ADD CONSTRAINT "RouteSegment_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "RouteNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteSegment" ADD CONSTRAINT "RouteSegment_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "RouteNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SegmentStep" ADD CONSTRAINT "SegmentStep_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "RouteSegment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
