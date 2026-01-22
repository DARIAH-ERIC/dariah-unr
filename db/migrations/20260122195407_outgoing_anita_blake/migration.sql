ALTER TYPE "dariah_unr"."body_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."country_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."event_size"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."institution_service_role"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."institution_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."outreach_kpi_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."outreach_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."project_scope"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."report_campaign_status"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."report_status"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."research_policy_level"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."role_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."service_audience"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."service_kpi_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."service_marketplace_status"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."service_size"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."service_status"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."service_type"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."software_marketplace_status"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."software_status"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."user_role"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."working_group_event_role"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."working_group_outreach_type"
SET SCHEMA "public";

--> statement-breakpoint
DROP TABLE "dariah_unr"."_prisma_migrations";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."bodies"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_BodyToRole"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."contributions"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."countries"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_CountryToInstitution"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_CountryToService"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_CountryToSoftware"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."event_reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."event_size_values"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."institution_service"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_InstitutionToPerson"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."institutions"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."outreach"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."outreach_kpis"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."outreach_reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."outreach_type_values"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."persons"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."projects"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."report_campaigns"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."research_policy_developments"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."role_type_values"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."roles"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."service_kpis"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."service_reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."service_size_values"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."services"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."sessions"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."software"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."users"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."working_group_events"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."working_group_outreach"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."working_group_reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."working_groups"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "_BodyToRole"
RENAME CONSTRAINT "_BodyToRole_A_fkey" TO "_BodyToRole_A_bodies_id_fkey";

--> statement-breakpoint
ALTER TABLE "_BodyToRole"
RENAME CONSTRAINT "_BodyToRole_B_fkey" TO "_BodyToRole_B_roles_id_fkey";

--> statement-breakpoint
ALTER TABLE "contributions"
RENAME CONSTRAINT "contributions_country_id_fkey" TO "contributions_country_id_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "contributions"
RENAME CONSTRAINT "contributions_person_id_fkey" TO "contributions_person_id_persons_id_fkey";

--> statement-breakpoint
ALTER TABLE "contributions"
RENAME CONSTRAINT "contributions_role_id_fkey" TO "contributions_role_id_roles_id_fkey";

--> statement-breakpoint
ALTER TABLE "contributions"
RENAME CONSTRAINT "contributions_working_group_id_fkey" TO "contributions_working_group_id_working_groups_id_fkey";

--> statement-breakpoint
ALTER TABLE "_CountryToInstitution"
RENAME CONSTRAINT "_CountryToInstitution_A_fkey" TO "_CountryToInstitution_A_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "_CountryToInstitution"
RENAME CONSTRAINT "_CountryToInstitution_B_fkey" TO "_CountryToInstitution_B_institutions_id_fkey";

--> statement-breakpoint
ALTER TABLE "_CountryToService"
RENAME CONSTRAINT "_CountryToService_A_fkey" TO "_CountryToService_A_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "_CountryToService"
RENAME CONSTRAINT "_CountryToService_B_fkey" TO "_CountryToService_B_services_id_fkey";

--> statement-breakpoint
ALTER TABLE "_CountryToSoftware"
RENAME CONSTRAINT "_CountryToSoftware_A_fkey" TO "_CountryToSoftware_A_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "_CountryToSoftware"
RENAME CONSTRAINT "_CountryToSoftware_B_fkey" TO "_CountryToSoftware_B_software_id_fkey";

--> statement-breakpoint
ALTER TABLE "event_reports"
RENAME CONSTRAINT "event_reports_report_id_fkey" TO "event_reports_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "event_size_values"
RENAME CONSTRAINT "event_size_values_report_campaign_id_fkey" TO "event_size_values_report_campaign_id_report_campaigns_id_fkey";

--> statement-breakpoint
ALTER TABLE "institution_service"
RENAME CONSTRAINT "institution_service_institution_id_fkey" TO "institution_service_institution_id_institutions_id_fkey";

--> statement-breakpoint
ALTER TABLE "institution_service"
RENAME CONSTRAINT "institution_service_service_id_fkey" TO "institution_service_service_id_services_id_fkey";

--> statement-breakpoint
ALTER TABLE "_InstitutionToPerson"
RENAME CONSTRAINT "_InstitutionToPerson_A_fkey" TO "_InstitutionToPerson_A_institutions_id_fkey";

--> statement-breakpoint
ALTER TABLE "_InstitutionToPerson"
RENAME CONSTRAINT "_InstitutionToPerson_B_fkey" TO "_InstitutionToPerson_B_persons_id_fkey";

--> statement-breakpoint
ALTER TABLE "outreach"
RENAME CONSTRAINT "outreach_country_id_fkey" TO "outreach_country_id_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "outreach_kpis"
RENAME CONSTRAINT "outreach_kpis_outreach_report_id_fkey" TO "outreach_kpis_outreach_report_id_outreach_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "outreach_reports"
RENAME CONSTRAINT "outreach_reports_outreach_id_fkey" TO "outreach_reports_outreach_id_outreach_id_fkey";

--> statement-breakpoint
ALTER TABLE "outreach_reports"
RENAME CONSTRAINT "outreach_reports_report_id_fkey" TO "outreach_reports_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "outreach_type_values"
RENAME CONSTRAINT "outreach_type_values_report_campaign_id_fkey" TO "outreach_type_values_iPsMEfcNSpWg_fkey";

--> statement-breakpoint
ALTER TABLE "projects"
RENAME CONSTRAINT "projects_report_id_fkey" TO "projects_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "reports"
RENAME CONSTRAINT "reports_country_id_fkey" TO "reports_country_id_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "reports"
RENAME CONSTRAINT "reports_report_campaign_id_fkey" TO "reports_report_campaign_id_report_campaigns_id_fkey";

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
RENAME CONSTRAINT "research_policy_developments_report_id_fkey" TO "research_policy_developments_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "role_type_values"
RENAME CONSTRAINT "role_type_values_report_campaign_id_fkey" TO "role_type_values_report_campaign_id_report_campaigns_id_fkey";

--> statement-breakpoint
ALTER TABLE "service_kpis"
RENAME CONSTRAINT "service_kpis_service_report_id_fkey" TO "service_kpis_service_report_id_service_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "service_reports"
RENAME CONSTRAINT "service_reports_report_id_fkey" TO "service_reports_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "service_reports"
RENAME CONSTRAINT "service_reports_service_id_fkey" TO "service_reports_service_id_services_id_fkey";

--> statement-breakpoint
ALTER TABLE "service_size_values"
RENAME CONSTRAINT "service_size_values_report_campaign_id_fkey" TO "service_size_values_report_campaign_id_report_campaigns_id_fkey";

--> statement-breakpoint
ALTER TABLE "sessions"
RENAME CONSTRAINT "sessions_user_id_fkey" TO "sessions_user_id_users_id_fkey";

--> statement-breakpoint
ALTER TABLE "users"
RENAME CONSTRAINT "users_country_id_fkey" TO "users_country_id_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "users"
RENAME CONSTRAINT "users_person_id_fkey" TO "users_person_id_persons_id_fkey";

--> statement-breakpoint
ALTER TABLE "working_group_events"
RENAME CONSTRAINT "working_group_events_report_id_fkey" TO "working_group_events_report_id_working_group_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "working_group_outreach"
RENAME CONSTRAINT "working_group_outreach_working_group_id_fkey" TO "working_group_outreach_working_group_id_working_groups_id_fkey";

--> statement-breakpoint
ALTER TABLE "working_group_reports"
RENAME CONSTRAINT "working_group_reports_report_campaign_id_fkey" TO "working_group_reports_working_group_id_working_groups_id_fkey";

--> statement-breakpoint
ALTER TABLE "working_group_reports"
RENAME CONSTRAINT "working_group_reports_working_group_id_fkey" TO "working_group_reports_HnKWwtDIJccw_fkey";

--> statement-breakpoint
ALTER TABLE "institutions"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "event_size_values"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "working_group_outreach"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "reports"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "working_group_reports"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "event_reports"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "services"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "service_kpis"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "report_campaigns"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "users"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "projects"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "bodies"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "roles"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "service_size_values"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "persons"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "outreach_type_values"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "outreach_reports"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "contributions"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "service_reports"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "outreach_kpis"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "working_group_events"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "role_type_values"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "outreach"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "working_groups"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "countries"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "software"
ALTER COLUMN "id"
SET DEFAULT GEN_RANDOM_UUID();

--> statement-breakpoint
ALTER TABLE "outreach_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "outreach_type_values"
ALTER COLUMN "created_at"
SET DEFAULT NOW();

--> statement-breakpoint
ALTER TABLE "roles"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "service_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "service_size_values"
ALTER COLUMN "created_at"
SET DEFAULT NOW();

--> statement-breakpoint
ALTER TABLE "event_size_values"
ALTER COLUMN "created_at"
SET DEFAULT NOW();

--> statement-breakpoint
ALTER TABLE "persons"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "service_kpis"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "role_type_values"
ALTER COLUMN "created_at"
SET DEFAULT NOW();

--> statement-breakpoint
ALTER TABLE "bodies"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "outreach_kpis"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "report_campaigns"
ALTER COLUMN "created_at"
SET DEFAULT NOW();

--> statement-breakpoint
ALTER TABLE "working_groups"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "institutions"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "working_group_outreach"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "event_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "software"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "working_group_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "contributions"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "outreach"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "countries"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "projects"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "services"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "_BodyToRole"
DROP CONSTRAINT "_BodyToRole_A_bodies_id_fkey",
ADD CONSTRAINT "_BodyToRole_A_bodies_id_fkey" FOREIGN key ("A") REFERENCES "bodies" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_BodyToRole"
DROP CONSTRAINT "_BodyToRole_B_roles_id_fkey",
ADD CONSTRAINT "_BodyToRole_B_roles_id_fkey" FOREIGN key ("B") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_CountryToInstitution"
DROP CONSTRAINT "_CountryToInstitution_A_countries_id_fkey",
ADD CONSTRAINT "_CountryToInstitution_A_countries_id_fkey" FOREIGN key ("A") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_CountryToInstitution"
DROP CONSTRAINT "_CountryToInstitution_B_institutions_id_fkey",
ADD CONSTRAINT "_CountryToInstitution_B_institutions_id_fkey" FOREIGN key ("B") REFERENCES "institutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_CountryToService"
DROP CONSTRAINT "_CountryToService_A_countries_id_fkey",
ADD CONSTRAINT "_CountryToService_A_countries_id_fkey" FOREIGN key ("A") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_CountryToService"
DROP CONSTRAINT "_CountryToService_B_services_id_fkey",
ADD CONSTRAINT "_CountryToService_B_services_id_fkey" FOREIGN key ("B") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_CountryToSoftware"
DROP CONSTRAINT "_CountryToSoftware_A_countries_id_fkey",
ADD CONSTRAINT "_CountryToSoftware_A_countries_id_fkey" FOREIGN key ("A") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_CountryToSoftware"
DROP CONSTRAINT "_CountryToSoftware_B_software_id_fkey",
ADD CONSTRAINT "_CountryToSoftware_B_software_id_fkey" FOREIGN key ("B") REFERENCES "software" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_InstitutionToPerson"
DROP CONSTRAINT "_InstitutionToPerson_A_institutions_id_fkey",
ADD CONSTRAINT "_InstitutionToPerson_A_institutions_id_fkey" FOREIGN key ("A") REFERENCES "institutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "_InstitutionToPerson"
DROP CONSTRAINT "_InstitutionToPerson_B_persons_id_fkey",
ADD CONSTRAINT "_InstitutionToPerson_B_persons_id_fkey" FOREIGN key ("B") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "contributions"
DROP CONSTRAINT "contributions_country_id_countries_id_fkey",
ADD CONSTRAINT "contributions_country_id_countries_id_fkey" FOREIGN key ("country_id") REFERENCES "countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "contributions"
DROP CONSTRAINT "contributions_person_id_persons_id_fkey",
ADD CONSTRAINT "contributions_person_id_persons_id_fkey" FOREIGN key ("person_id") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "contributions"
DROP CONSTRAINT "contributions_role_id_roles_id_fkey",
ADD CONSTRAINT "contributions_role_id_roles_id_fkey" FOREIGN key ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "contributions"
DROP CONSTRAINT "contributions_working_group_id_working_groups_id_fkey",
ADD CONSTRAINT "contributions_working_group_id_working_groups_id_fkey" FOREIGN key ("working_group_id") REFERENCES "working_groups" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "event_reports"
DROP CONSTRAINT "event_reports_report_id_reports_id_fkey",
ADD CONSTRAINT "event_reports_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "event_size_values"
DROP CONSTRAINT "event_size_values_report_campaign_id_report_campaigns_id_fkey",
ADD CONSTRAINT "event_size_values_report_campaign_id_report_campaigns_id_fkey" FOREIGN key ("report_campaign_id") REFERENCES "report_campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "institution_service"
DROP CONSTRAINT "institution_service_institution_id_institutions_id_fkey",
ADD CONSTRAINT "institution_service_institution_id_institutions_id_fkey" FOREIGN key ("institution_id") REFERENCES "institutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "institution_service"
DROP CONSTRAINT "institution_service_service_id_services_id_fkey",
ADD CONSTRAINT "institution_service_service_id_services_id_fkey" FOREIGN key ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "outreach"
DROP CONSTRAINT "outreach_country_id_countries_id_fkey",
ADD CONSTRAINT "outreach_country_id_countries_id_fkey" FOREIGN key ("country_id") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "outreach_kpis"
DROP CONSTRAINT "outreach_kpis_outreach_report_id_outreach_reports_id_fkey",
ADD CONSTRAINT "outreach_kpis_outreach_report_id_outreach_reports_id_fkey" FOREIGN key ("outreach_report_id") REFERENCES "outreach_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "outreach_reports"
DROP CONSTRAINT "outreach_reports_outreach_id_outreach_id_fkey",
ADD CONSTRAINT "outreach_reports_outreach_id_outreach_id_fkey" FOREIGN key ("outreach_id") REFERENCES "outreach" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "outreach_reports"
DROP CONSTRAINT "outreach_reports_report_id_reports_id_fkey",
ADD CONSTRAINT "outreach_reports_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "outreach_type_values"
DROP CONSTRAINT "outreach_type_values_iPsMEfcNSpWg_fkey",
ADD CONSTRAINT "outreach_type_values_iPsMEfcNSpWg_fkey" FOREIGN key ("report_campaign_id") REFERENCES "report_campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "projects"
DROP CONSTRAINT "projects_report_id_reports_id_fkey",
ADD CONSTRAINT "projects_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "reports"
DROP CONSTRAINT "reports_country_id_countries_id_fkey",
ADD CONSTRAINT "reports_country_id_countries_id_fkey" FOREIGN key ("country_id") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "reports"
DROP CONSTRAINT "reports_report_campaign_id_report_campaigns_id_fkey",
ADD CONSTRAINT "reports_report_campaign_id_report_campaigns_id_fkey" FOREIGN key ("report_campaign_id") REFERENCES "report_campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
DROP CONSTRAINT "research_policy_developments_report_id_reports_id_fkey",
ADD CONSTRAINT "research_policy_developments_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "role_type_values"
DROP CONSTRAINT "role_type_values_report_campaign_id_report_campaigns_id_fkey",
ADD CONSTRAINT "role_type_values_report_campaign_id_report_campaigns_id_fkey" FOREIGN key ("report_campaign_id") REFERENCES "report_campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "service_kpis"
DROP CONSTRAINT "service_kpis_service_report_id_service_reports_id_fkey",
ADD CONSTRAINT "service_kpis_service_report_id_service_reports_id_fkey" FOREIGN key ("service_report_id") REFERENCES "service_reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "service_reports"
DROP CONSTRAINT "service_reports_report_id_reports_id_fkey",
ADD CONSTRAINT "service_reports_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "service_reports"
DROP CONSTRAINT "service_reports_service_id_services_id_fkey",
ADD CONSTRAINT "service_reports_service_id_services_id_fkey" FOREIGN key ("service_id") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "service_size_values"
DROP CONSTRAINT "service_size_values_report_campaign_id_report_campaigns_id_fkey",
ADD CONSTRAINT "service_size_values_report_campaign_id_report_campaigns_id_fkey" FOREIGN key ("report_campaign_id") REFERENCES "report_campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "sessions"
DROP CONSTRAINT "sessions_user_id_users_id_fkey",
ADD CONSTRAINT "sessions_user_id_users_id_fkey" FOREIGN key ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "users"
DROP CONSTRAINT "users_country_id_countries_id_fkey",
ADD CONSTRAINT "users_country_id_countries_id_fkey" FOREIGN key ("country_id") REFERENCES "countries" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "users"
DROP CONSTRAINT "users_person_id_persons_id_fkey",
ADD CONSTRAINT "users_person_id_persons_id_fkey" FOREIGN key ("person_id") REFERENCES "persons" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "working_group_events"
DROP CONSTRAINT "working_group_events_report_id_working_group_reports_id_fkey",
ADD CONSTRAINT "working_group_events_report_id_working_group_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "working_group_reports" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "working_group_outreach"
DROP CONSTRAINT "working_group_outreach_working_group_id_working_groups_id_fkey",
ADD CONSTRAINT "working_group_outreach_working_group_id_working_groups_id_fkey" FOREIGN key ("working_group_id") REFERENCES "working_groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "working_group_reports"
DROP CONSTRAINT "working_group_reports_working_group_id_working_groups_id_fkey",
ADD CONSTRAINT "working_group_reports_working_group_id_working_groups_id_fkey" FOREIGN key ("working_group_id") REFERENCES "working_groups" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "working_group_reports"
DROP CONSTRAINT "working_group_reports_HnKWwtDIJccw_fkey",
ADD CONSTRAINT "working_group_reports_HnKWwtDIJccw_fkey" FOREIGN key ("report_campaign_id") REFERENCES "report_campaigns" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

--> statement-breakpoint
DROP SCHEMA "dariah_unr";
