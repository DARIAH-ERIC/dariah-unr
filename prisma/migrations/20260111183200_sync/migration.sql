-- AlterTable
ALTER TABLE "event_size_values" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "event_size_values" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "outreach_type_values" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "outreach_type_values" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "role_type_values" RENAME CONSTRAINT "role_values_pkey" TO "role_type_values_pkey";
ALTER TABLE "role_type_values" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "role_type_values" ALTER COLUMN "updated_at" DROP DEFAULT;

-- AlterTable
ALTER TABLE "service_size_values" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "service_size_values" ALTER COLUMN "updated_at" DROP DEFAULT;

-- RenameForeignKey
ALTER TABLE "role_type_values" RENAME CONSTRAINT "role_values_report_campaign_id_fkey" TO "role_type_values_report_campaign_id_fkey";
