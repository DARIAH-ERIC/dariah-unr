/*
  Warnings:

  - Made the column `report_id` on table `working_group_events` required. This step will fail if there are existing NULL values in that column.
  - Made the column `working_group_id` on table `working_group_outreach` required. This step will fail if there are existing NULL values in that column.
  - Made the column `working_group_id` on table `working_group_reports` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "working_group_events" DROP CONSTRAINT "working_group_events_report_id_fkey";

-- DropForeignKey
ALTER TABLE "working_group_outreach" DROP CONSTRAINT "working_group_outreach_working_group_id_fkey";

-- DropForeignKey
ALTER TABLE "working_group_reports" DROP CONSTRAINT "working_group_reports_working_group_id_fkey";

-- AlterTable
ALTER TABLE "working_group_events" ALTER COLUMN "report_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "working_group_outreach" ALTER COLUMN "working_group_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "working_group_reports" ALTER COLUMN "working_group_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "working_group_reports" ADD CONSTRAINT "working_group_reports_working_group_id_fkey" FOREIGN KEY ("working_group_id") REFERENCES "working_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_group_events" ADD CONSTRAINT "working_group_events_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "working_group_reports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_group_outreach" ADD CONSTRAINT "working_group_outreach_working_group_id_fkey" FOREIGN KEY ("working_group_id") REFERENCES "working_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
