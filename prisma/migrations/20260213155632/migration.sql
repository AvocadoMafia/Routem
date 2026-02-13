/*
  Warnings:

  - Added the required column `order` to the `TransitStep` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TransitStep" ADD COLUMN     "order" INTEGER NOT NULL;
