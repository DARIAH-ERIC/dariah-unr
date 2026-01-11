-- AlterTable
ALTER TABLE "projects" RENAME CONSTRAINT "projects_funding_leverage_pkey" TO "projects_pkey";

-- AlterTable
ALTER TABLE "report_campaigns" RENAME COLUMN "serviceSizeThresholds" TO "service_size_thresholds";

-- AlterTable
ALTER TABLE "reports" RENAME COLUMN "contributionsCount" TO "contributions_count";
ALTER TABLE "reports" RENAME COLUMN "operationalCost" TO "operational_cost";
ALTER TABLE "reports" RENAME COLUMN "operationalCostDetail" TO "operational_cost_detail";
ALTER TABLE "reports" RENAME COLUMN "operationalCostThreshold" TO "operational_cost_threshold";

-- RenameForeignKey
ALTER TABLE "projects" RENAME CONSTRAINT "projects_funding_leverage_report_id_fkey" TO "projects_report_id_fkey";
