-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('bod', 'dco', 'ga', 'jrc', 'ncc', 'sb', 'smt');

-- CreateEnum
CREATE TYPE "CountryType" AS ENUM ('cooperating_partnership', 'member_country', 'other');

-- CreateEnum
CREATE TYPE "EventSizeType" AS ENUM ('dariah_commissioned', 'large', 'medium', 'small');

-- CreateEnum
CREATE TYPE "InstitutionType" AS ENUM ('cooperating_partner', 'national_coordinating_institution', 'national_representative_institution', 'other', 'partner_institution');

-- CreateEnum
CREATE TYPE "InstitutionServiceRole" AS ENUM ('content_provider', 'service_owner', 'service_provider', 'technical_contact');

-- CreateEnum
CREATE TYPE "OutreachType" AS ENUM ('national_website', 'social_media');

-- CreateEnum
CREATE TYPE "OutreachKpiType" AS ENUM ('engagement', 'followers', 'impressions', 'mention', 'new_content', 'page_views', 'posts', 'reach', 'subscribers', 'unique_visitors', 'views', 'watch_time');

-- CreateEnum
CREATE TYPE "ProjectScope" AS ENUM ('eu', 'national', 'regional');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('draft', 'final');

-- CreateEnum
CREATE TYPE "ResearchPolicyLevel" AS ENUM ('eu', 'international', 'institutional', 'national', 'regional');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('dco_member', 'director', 'national_coordinator', 'national_coordinator_deputy', 'national_representative', 'jrc_member', 'scientific_board_member', 'smt_member', 'wg_chair', 'wg_member');

-- CreateEnum
CREATE TYPE "ServiceAudience" AS ENUM ('dariah_team', 'global', 'national_local');

-- CreateEnum
CREATE TYPE "ServiceMarketplaceStatus" AS ENUM ('no', 'not_applicable', 'yes');

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('discontinued', 'in_preparation', 'live', 'needs_review', 'to_be_discontinued');

-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('community', 'core', 'internal');

-- CreateEnum
CREATE TYPE "ServiceSizeType" AS ENUM ('core', 'large', 'medium', 'small');

-- CreateEnum
CREATE TYPE "ServiceKpiType" AS ENUM ('downloads', 'hits', 'items', 'jobs_processed', 'page_views', 'registered_users', 'searches', 'sessions', 'unique_users', 'visits', 'websites_hosted');

-- CreateEnum
CREATE TYPE "SoftwareMarketplaceStatus" AS ENUM ('added_as_external_id', 'added_as_item', 'no', 'not_applicable');

-- CreateEnum
CREATE TYPE "SoftwareStatus" AS ENUM ('maintained', 'needs_review', 'not_maintained');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'contributor', 'national_coordinator');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('unverified', 'verified');

-- CreateTable
CREATE TABLE "bodies" (
    "id" UUID NOT NULL,
    "acronym" TEXT,
    "name" TEXT NOT NULL,
    "type" "BodyType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contributions" (
    "id" UUID NOT NULL,
    "end_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "country_id" UUID,
    "person_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "working_group_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "end_date" TIMESTAMP(3),
    "logo" TEXT,
    "marketplace_id" INTEGER,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "type" "CountryType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_sizes" (
    "id" UUID NOT NULL,
    "annual_value" INTEGER NOT NULL,
    "type" "EventSizeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_reports" (
    "id" UUID NOT NULL,
    "dariah_commissioned_event" TEXT,
    "large_meetings" INTEGER,
    "medium_meetings" INTEGER,
    "reusable_outcomes" TEXT,
    "small_meetings" INTEGER,
    "report_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutions" (
    "id" UUID NOT NULL,
    "end_date" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "ror" TEXT,
    "start_date" TIMESTAMP(3),
    "types" "InstitutionType"[],
    "url" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institution_service" (
    "role" "InstitutionServiceRole" NOT NULL,
    "institution_id" UUID NOT NULL,
    "service_id" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "outreach" (
    "id" UUID NOT NULL,
    "end_date" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "type" "OutreachType" NOT NULL,
    "url" TEXT NOT NULL,
    "country_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outreach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outreach_type_values" (
    "id" UUID NOT NULL,
    "annual_value" INTEGER NOT NULL,
    "type" "OutreachType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outreach_type_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outreach_reports" (
    "id" UUID NOT NULL,
    "outreach_id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outreach_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "outreach_kpis" (
    "id" UUID NOT NULL,
    "unit" "OutreachKpiType" NOT NULL,
    "value" INTEGER NOT NULL,
    "outreach_report_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outreach_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persons" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "name" TEXT NOT NULL,
    "orcid" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects_funding_leverage" (
    "id" UUID NOT NULL,
    "amount" INTEGER,
    "funders" TEXT,
    "name" TEXT NOT NULL,
    "project_months" INTEGER,
    "scope" "ProjectScope",
    "start_date" TIMESTAMP(3),
    "total_amount" INTEGER,
    "report_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_funding_leverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "comments" JSONB,
    "contributionsCount" INTEGER,
    "operationalCost" INTEGER,
    "operationalCostDetail" JSONB,
    "operationalCostThreshold" INTEGER,
    "status" "ReportStatus" NOT NULL DEFAULT 'draft',
    "year" INTEGER NOT NULL,
    "country_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_policy_developments" (
    "id" UUID NOT NULL,
    "level" "ResearchPolicyLevel" NOT NULL,
    "name" TEXT NOT NULL,
    "outcome" TEXT,
    "report_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "research_policy_developments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "annual_value" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "agreements" TEXT,
    "audience" "ServiceAudience",
    "dariah_branding" BOOLEAN,
    "eosc_onboarding" BOOLEAN,
    "marketplace_status" "ServiceMarketplaceStatus",
    "marketplace_id" TEXT,
    "monitoring" BOOLEAN,
    "name" TEXT NOT NULL,
    "private_supplier" BOOLEAN,
    "status" "ServiceStatus",
    "technical_contact" TEXT,
    "technical_readiness_level" INTEGER,
    "type" "ServiceType",
    "url" TEXT[],
    "value_proposition" TEXT,
    "size_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_sizes" (
    "id" UUID NOT NULL,
    "annual_value" INTEGER NOT NULL,
    "type" "ServiceSizeType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_reports" (
    "id" UUID NOT NULL,
    "report_id" UUID NOT NULL,
    "service_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_kpis" (
    "id" UUID NOT NULL,
    "unit" "ServiceKpiType" NOT NULL,
    "value" INTEGER NOT NULL,
    "service_report_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "software" (
    "id" UUID NOT NULL,
    "comment" TEXT,
    "name" TEXT NOT NULL,
    "marketplace_status" "SoftwareMarketplaceStatus",
    "marketplace_id" TEXT,
    "status" "SoftwareStatus",
    "url" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "software_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "working_groups" (
    "id" UUID NOT NULL,
    "end_date" TIMESTAMP(3),
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "working_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "id_token" TEXT,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "scope" TEXT,
    "session_state" TEXT,
    "token_type" TEXT,
    "type" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'contributor',
    "status" "UserStatus" NOT NULL DEFAULT 'unverified',
    "country_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BodyToRole" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CountryToInstitution" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CountryToService" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_CountryToSoftware" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_InstitutionToPerson" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE INDEX "countries_code_idx" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "event_reports_report_id_key" ON "event_reports"("report_id");

-- CreateIndex
CREATE UNIQUE INDEX "institution_service_institution_id_role_service_id_key" ON "institution_service"("institution_id", "role", "service_id");

-- CreateIndex
CREATE INDEX "reports_year_idx" ON "reports"("year");

-- CreateIndex
CREATE UNIQUE INDEX "reports_country_id_year_key" ON "reports"("country_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_BodyToRole_AB_unique" ON "_BodyToRole"("A", "B");

-- CreateIndex
CREATE INDEX "_BodyToRole_B_index" ON "_BodyToRole"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToInstitution_AB_unique" ON "_CountryToInstitution"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToInstitution_B_index" ON "_CountryToInstitution"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToService_AB_unique" ON "_CountryToService"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToService_B_index" ON "_CountryToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToSoftware_AB_unique" ON "_CountryToSoftware"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToSoftware_B_index" ON "_CountryToSoftware"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InstitutionToPerson_AB_unique" ON "_InstitutionToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_InstitutionToPerson_B_index" ON "_InstitutionToPerson"("B");

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contributions" ADD CONSTRAINT "contributions_working_group_id_fkey" FOREIGN KEY ("working_group_id") REFERENCES "working_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_reports" ADD CONSTRAINT "event_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_service" ADD CONSTRAINT "institution_service_institution_id_fkey" FOREIGN KEY ("institution_id") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institution_service" ADD CONSTRAINT "institution_service_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach" ADD CONSTRAINT "outreach_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach_reports" ADD CONSTRAINT "outreach_reports_outreach_id_fkey" FOREIGN KEY ("outreach_id") REFERENCES "outreach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach_reports" ADD CONSTRAINT "outreach_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outreach_kpis" ADD CONSTRAINT "outreach_kpis_outreach_report_id_fkey" FOREIGN KEY ("outreach_report_id") REFERENCES "outreach_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects_funding_leverage" ADD CONSTRAINT "projects_funding_leverage_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "research_policy_developments" ADD CONSTRAINT "research_policy_developments_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "service_sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_reports" ADD CONSTRAINT "service_reports_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_reports" ADD CONSTRAINT "service_reports_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_kpis" ADD CONSTRAINT "service_kpis_service_report_id_fkey" FOREIGN KEY ("service_report_id") REFERENCES "service_reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BodyToRole" ADD CONSTRAINT "_BodyToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "bodies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BodyToRole" ADD CONSTRAINT "_BodyToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToInstitution" ADD CONSTRAINT "_CountryToInstitution_A_fkey" FOREIGN KEY ("A") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToInstitution" ADD CONSTRAINT "_CountryToInstitution_B_fkey" FOREIGN KEY ("B") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToService" ADD CONSTRAINT "_CountryToService_A_fkey" FOREIGN KEY ("A") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToService" ADD CONSTRAINT "_CountryToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToSoftware" ADD CONSTRAINT "_CountryToSoftware_A_fkey" FOREIGN KEY ("A") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CountryToSoftware" ADD CONSTRAINT "_CountryToSoftware_B_fkey" FOREIGN KEY ("B") REFERENCES "software"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstitutionToPerson" ADD CONSTRAINT "_InstitutionToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InstitutionToPerson" ADD CONSTRAINT "_InstitutionToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
