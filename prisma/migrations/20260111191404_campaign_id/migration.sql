/*
  Warnings:

  - Made the column `report_campaign_id` on table `event_size_values` required. This step will fail if there are existing NULL values in that column.
  - Made the column `report_campaign_id` on table `outreach_type_values` required. This step will fail if there are existing NULL values in that column.
  - Made the column `report_campaign_id` on table `role_type_values` required. This step will fail if there are existing NULL values in that column.
  - Made the column `report_campaign_id` on table `service_size_values` required. This step will fail if there are existing NULL values in that column.

*/

DELETE FROM "event_size_values" WHERE "report_campaign_id" IS NULL;
DELETE FROM "outreach_type_values" WHERE "report_campaign_id" IS NULL;
DELETE FROM "role_type_values" WHERE "report_campaign_id" IS NULL;
DELETE FROM "service_size_values" WHERE "report_campaign_id" IS NULL;

-- DropForeignKey
ALTER TABLE "event_size_values" DROP CONSTRAINT "event_size_values_report_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "outreach_type_values" DROP CONSTRAINT "outreach_type_values_report_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "reports" DROP CONSTRAINT "reports_report_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "role_type_values" DROP CONSTRAINT "role_type_values_report_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "service_size_values" DROP CONSTRAINT "service_size_values_report_campaign_id_fkey";

-- DropForeignKey
ALTER TABLE "working_group_reports" DROP CONSTRAINT "working_group_reports_report_campaign_id_fkey";

-- AlterTable
ALTER TABLE "event_size_values" ALTER COLUMN "report_campaign_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "outreach_type_values" ALTER COLUMN "report_campaign_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "reports" DROP COLUMN "year",
ALTER COLUMN "report_campaign_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "role_type_values" ALTER COLUMN "report_campaign_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "service_size_values" ALTER COLUMN "report_campaign_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "working_group_reports" DROP COLUMN "year",
ALTER COLUMN "report_campaign_id" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_size_values_report_campaign_id_type_key" ON "event_size_values"("report_campaign_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "outreach_type_values_report_campaign_id_type_key" ON "outreach_type_values"("report_campaign_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "reports_report_campaign_id_country_id_key" ON "reports"("report_campaign_id", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_values_report_campaign_id_type_key" ON "role_type_values"("report_campaign_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "service_size_values_report_campaign_id_type_key" ON "service_size_values"("report_campaign_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "working_group_reports_report_campaign_id_working_group_id_key" ON "working_group_reports"("report_campaign_id", "working_group_id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_group_reports" ADD CONSTRAINT "working_group_reports_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_size_values" ADD CONSTRAINT "event_size_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach_type_values" ADD CONSTRAINT "outreach_type_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_type_values" ADD CONSTRAINT "role_type_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_size_values" ADD CONSTRAINT "service_size_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
