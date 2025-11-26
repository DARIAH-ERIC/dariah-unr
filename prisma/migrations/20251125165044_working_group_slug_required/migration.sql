/*
  Warnings:

  - Made the column `slug` on table `working_groups` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "working_groups" ALTER COLUMN "slug" SET NOT NULL;
