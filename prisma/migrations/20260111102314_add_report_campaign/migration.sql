-- CreateEnum
CREATE TYPE "ReportCampaignStatus" AS ENUM ('in_progress', 'done');

-- DropIndex
DROP INDEX "reports_country_id_year_key";

-- DropIndex
DROP INDEX "reports_year_idx";

-- DropIndex
DROP INDEX "working_group_reports_working_group_id_year_key";

-- DropIndex
DROP INDEX "working_group_reports_year_idx";

-- AlterTable
ALTER TABLE "event_size_values" RENAME CONSTRAINT "event_sizes_pkey" TO "event_size_values_pkey";
ALTER TABLE "event_size_values" ADD COLUMN     "report_campaign_id" UUID;

-- AlterTable
ALTER TABLE "outreach_type_values" ADD COLUMN     "report_campaign_id" UUID;

-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "report_campaign_id" UUID;

-- AlterTable
ALTER TABLE "service_size_values" RENAME CONSTRAINT "service_sizes_pkey" TO "service_size_values_pkey";
ALTER TABLE "service_size_values" ADD COLUMN     "report_campaign_id" UUID;

-- AlterTable
ALTER TABLE "working_group_reports" ADD COLUMN     "report_campaign_id" UUID;

-- CreateTable
CREATE TABLE "role_values" (
    "id" UUID NOT NULL,
    "annual_value" INTEGER NOT NULL,
    "type" "RoleType" NOT NULL,
    "report_campaign_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_campaigns" (
    "id" UUID NOT NULL,
    "serviceSizeThresholds" JSONB NOT NULL,
    "status" "ReportCampaignStatus" NOT NULL DEFAULT 'in_progress',
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "report_campaigns_year_key" ON "report_campaigns"("year");

-- CreateIndex
CREATE INDEX "report_campaigns_year_idx" ON "report_campaigns"("year");

-- CreateIndex
CREATE INDEX "reports_report_campaign_id_idx" ON "reports"("report_campaign_id");

-- CreateIndex
CREATE INDEX "working_group_reports_report_campaign_id_idx" ON "working_group_reports"("report_campaign_id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "working_group_reports" ADD CONSTRAINT "working_group_reports_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_size_values" ADD CONSTRAINT "event_size_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach_type_values" ADD CONSTRAINT "outreach_type_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_values" ADD CONSTRAINT "role_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_size_values" ADD CONSTRAINT "service_size_values_report_campaign_id_fkey" FOREIGN KEY ("report_campaign_id") REFERENCES "report_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
