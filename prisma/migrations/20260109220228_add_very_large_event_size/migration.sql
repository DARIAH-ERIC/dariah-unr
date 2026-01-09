/*
  Warnings:

  - You are about to drop the column `size_id` on the `services` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "EventSizeType" ADD VALUE 'very_large';

-- DropForeignKey
ALTER TABLE "services" DROP CONSTRAINT "services_size_id_fkey";

-- AlterTable
ALTER TABLE "event_reports" ADD COLUMN     "very_large_meetings" INTEGER;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "size_id";
