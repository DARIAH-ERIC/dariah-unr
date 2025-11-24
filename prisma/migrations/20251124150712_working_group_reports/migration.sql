/*
  Warnings:

  - You are about to drop the column `wGEventDetailId` on the `working_groups` table. All the data in the column will be lost.
  - You are about to drop the `WGEventDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wgreports` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WorkingGroupEventRole" AS ENUM ('organiser', 'presenter');

-- CreateEnum
CREATE TYPE "WorkingGroupOutreachType" AS ENUM ('website', 'social_media');

-- DropForeignKey
ALTER TABLE "wgreports" DROP CONSTRAINT "wgreports_eventReportId_fkey";

-- DropForeignKey
ALTER TABLE "wgreports" DROP CONSTRAINT "wgreports_working_group_id_fkey";

-- DropForeignKey
ALTER TABLE "working_groups" DROP CONSTRAINT "working_groups_wGEventDetailId_fkey";

-- AlterTable
ALTER TABLE "working_groups" DROP COLUMN "wGEventDetailId";

-- DropTable
DROP TABLE "WGEventDetail";

-- DropTable
DROP TABLE "wgreports";

-- CreateTable
CREATE TABLE "working_group_reports" (
    "id" UUID NOT NULL,
    "comments" JSONB,
    "facultative_questions" TEXT NOT NULL,
    "members" INTEGER,
    "narrative_report" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'draft',
    "year" INTEGER NOT NULL,
    "working_group_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_group_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_group_events" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3),
    "role" "WorkingGroupEventRole" NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "report_id" UUID,

    CONSTRAINT "working_group_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_group_outreach" (
    "id" UUID NOT NULL,
    "end_date" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "type" "OutreachType" NOT NULL,
    "url" TEXT NOT NULL,
    "working_group_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_group_outreach_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "working_group_reports_year_idx" ON "working_group_reports"("year");

-- CreateIndex
CREATE UNIQUE INDEX "working_group_reports_working_group_id_year_key" ON "working_group_reports"("working_group_id", "year");

-- AddForeignKey
ALTER TABLE "working_group_reports" ADD CONSTRAINT "working_group_reports_working_group_id_fkey" FOREIGN KEY ("working_group_id") REFERENCES "working_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_group_events" ADD CONSTRAINT "working_group_events_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "working_group_reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_group_outreach" ADD CONSTRAINT "working_group_outreach_working_group_id_fkey" FOREIGN KEY ("working_group_id") REFERENCES "working_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
