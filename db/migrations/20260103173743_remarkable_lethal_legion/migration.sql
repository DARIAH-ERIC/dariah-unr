ALTER TYPE "dariah_unr"."BodyType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."CountryType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."EventSizeType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."InstitutionServiceRole"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."InstitutionType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."OutreachKpiType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."OutreachType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ProjectScope"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ReportStatus"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ResearchPolicyLevel"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."RoleType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ServiceAudience"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ServiceKpiType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ServiceMarketplaceStatus"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ServiceSizeType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ServiceStatus"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."ServiceType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."SoftwareMarketplaceStatus"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."SoftwareStatus"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."UserRole"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."WorkingGroupEventRole"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "dariah_unr"."WorkingGroupOutreachType"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TYPE "BodyType"
RENAME TO "body_type";

--> statement-breakpoint
ALTER TYPE "CountryType"
RENAME TO "country_type";

--> statement-breakpoint
ALTER TYPE "EventSizeType"
RENAME TO "event_size_type";

--> statement-breakpoint
ALTER TYPE "InstitutionServiceRole"
RENAME TO "institution_service_role";

--> statement-breakpoint
ALTER TYPE "InstitutionType"
RENAME TO "institution_type";

--> statement-breakpoint
ALTER TYPE "OutreachKpiType"
RENAME TO "outreach_kpi_type";

--> statement-breakpoint
ALTER TYPE "OutreachType"
RENAME TO "outreach_type";

--> statement-breakpoint
ALTER TYPE "ProjectScope"
RENAME TO "project_scope";

--> statement-breakpoint
ALTER TYPE "ReportStatus"
RENAME TO "report_status";

--> statement-breakpoint
ALTER TYPE "ResearchPolicyLevel"
RENAME TO "research_policy_level";

--> statement-breakpoint
ALTER TYPE "RoleType"
RENAME TO "role_type";

--> statement-breakpoint
ALTER TYPE "ServiceAudience"
RENAME TO "service_audience";

--> statement-breakpoint
ALTER TYPE "ServiceKpiType"
RENAME TO "service_kpi_type";

--> statement-breakpoint
ALTER TYPE "ServiceMarketplaceStatus"
RENAME TO "service_marketplace_status";

--> statement-breakpoint
ALTER TYPE "ServiceSizeType"
RENAME TO "service_size_type";

--> statement-breakpoint
ALTER TYPE "ServiceStatus"
RENAME TO "service_status";

--> statement-breakpoint
ALTER TYPE "ServiceType"
RENAME TO "service_type";

--> statement-breakpoint
ALTER TYPE "SoftwareMarketplaceStatus"
RENAME TO "software_marketplace_status";

--> statement-breakpoint
ALTER TYPE "SoftwareStatus"
RENAME TO "software_status";

--> statement-breakpoint
ALTER TYPE "UserRole"
RENAME TO "user_role";

--> statement-breakpoint
ALTER TYPE "WorkingGroupEventRole"
RENAME TO "working_group_event_role";

--> statement-breakpoint
ALTER TYPE "WorkingGroupOutreachType"
RENAME TO "working_group_outreach_type";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_BodyToRole"
RENAME TO "body_to_role";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_CountryToInstitution"
RENAME TO "country_to_institution";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_CountryToService"
RENAME TO "country_to_service";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_CountryToSoftware"
RENAME TO "country_to_software";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."_InstitutionToPerson"
RENAME TO "institution_to_person";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."projects_funding_leverage"
RENAME TO "projects";

--> statement-breakpoint
DROP TABLE "dariah_unr"."_prisma_migrations";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."bodies"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."body_to_role"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."contributions"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."countries"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."country_to_institution"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."country_to_service"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."country_to_software"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."event_reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."event_sizes"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."institution_service"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."institution_to_person"
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
ALTER TABLE "dariah_unr"."reports"
SET SCHEMA "public";

--> statement-breakpoint
ALTER TABLE "dariah_unr"."research_policy_developments"
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
ALTER TABLE "dariah_unr"."service_sizes"
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
ALTER TABLE "reports"
RENAME COLUMN "contributionsCount" TO "contributions_count";

--> statement-breakpoint
ALTER TABLE "reports"
RENAME COLUMN "operationalCost" TO "operational_cost";

--> statement-breakpoint
ALTER TABLE "reports"
RENAME COLUMN "operationalCostDetail" TO "operational_cost_detail";

--> statement-breakpoint
ALTER TABLE "reports"
RENAME COLUMN "operationalCostThreshold" TO "operational_cost_threshold";

--> statement-breakpoint
ALTER TABLE "body_to_role"
RENAME CONSTRAINT "_BodyToRole_A_fkey" TO "body_to_role_A_bodies_id_fkey";

--> statement-breakpoint
ALTER TABLE "body_to_role"
RENAME CONSTRAINT "_BodyToRole_B_fkey" TO "body_to_role_B_roles_id_fkey";

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
ALTER TABLE "country_to_institution"
RENAME CONSTRAINT "_CountryToInstitution_A_fkey" TO "country_to_institution_A_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "country_to_institution"
RENAME CONSTRAINT "_CountryToInstitution_B_fkey" TO "country_to_institution_B_institutions_id_fkey";

--> statement-breakpoint
ALTER TABLE "country_to_service"
RENAME CONSTRAINT "_CountryToService_A_fkey" TO "country_to_service_A_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "country_to_service"
RENAME CONSTRAINT "_CountryToService_B_fkey" TO "country_to_service_B_services_id_fkey";

--> statement-breakpoint
ALTER TABLE "country_to_software"
RENAME CONSTRAINT "_CountryToSoftware_A_fkey" TO "country_to_software_A_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "country_to_software"
RENAME CONSTRAINT "_CountryToSoftware_B_fkey" TO "country_to_software_B_software_id_fkey";

--> statement-breakpoint
ALTER TABLE "event_reports"
RENAME CONSTRAINT "event_reports_report_id_fkey" TO "event_reports_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "institution_service"
RENAME CONSTRAINT "institution_service_institution_id_fkey" TO "institution_service_institution_id_institutions_id_fkey";

--> statement-breakpoint
ALTER TABLE "institution_service"
RENAME CONSTRAINT "institution_service_service_id_fkey" TO "institution_service_service_id_services_id_fkey";

--> statement-breakpoint
ALTER TABLE "institution_to_person"
RENAME CONSTRAINT "_InstitutionToPerson_A_fkey" TO "institution_to_person_A_institutions_id_fkey";

--> statement-breakpoint
ALTER TABLE "institution_to_person"
RENAME CONSTRAINT "_InstitutionToPerson_B_fkey" TO "institution_to_person_B_persons_id_fkey";

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
ALTER TABLE "projects"
RENAME CONSTRAINT "projects_funding_leverage_report_id_fkey" TO "projects_report_id_reports_id_fkey";

--> statement-breakpoint
ALTER TABLE "reports"
RENAME CONSTRAINT "reports_country_id_fkey" TO "reports_country_id_countries_id_fkey";

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
RENAME CONSTRAINT "research_policy_developments_report_id_fkey" TO "research_policy_developments_report_id_reports_id_fkey";

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
ALTER TABLE "services"
RENAME CONSTRAINT "services_size_id_fkey" TO "services_size_id_service_sizes_id_fkey";

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
RENAME CONSTRAINT "working_group_reports_working_group_id_fkey" TO "working_group_reports_working_group_id_working_groups_id_fkey";

--> statement-breakpoint
ALTER TABLE "projects"
RENAME CONSTRAINT "projects_funding_leverage_pkey" TO "projects_pkey";

--> statement-breakpoint
ALTER TABLE "outreach_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "event_sizes"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "outreach_type_values"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "service_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "service_sizes"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "roles"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "service_kpis"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "working_groups"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "bodies"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "persons"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "outreach_kpis"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "contributions"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "institutions"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "event_reports"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "outreach"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "working_group_outreach"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "software"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "countries"
ALTER COLUMN "created_at"
SET DEFAULT current_timestamp;

--> statement-breakpoint
ALTER TABLE "working_group_reports"
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
ALTER TABLE "body_to_role"
DROP CONSTRAINT "body_to_role_A_bodies_id_fkey",
ADD CONSTRAINT "body_to_role_A_bodies_id_fkey" FOREIGN key ("A") REFERENCES "bodies" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "body_to_role"
DROP CONSTRAINT "body_to_role_B_roles_id_fkey",
ADD CONSTRAINT "body_to_role_B_roles_id_fkey" FOREIGN key ("B") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "country_to_institution"
DROP CONSTRAINT "country_to_institution_A_countries_id_fkey",
ADD CONSTRAINT "country_to_institution_A_countries_id_fkey" FOREIGN key ("A") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "country_to_institution"
DROP CONSTRAINT "country_to_institution_B_institutions_id_fkey",
ADD CONSTRAINT "country_to_institution_B_institutions_id_fkey" FOREIGN key ("B") REFERENCES "institutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "country_to_service"
DROP CONSTRAINT "country_to_service_A_countries_id_fkey",
ADD CONSTRAINT "country_to_service_A_countries_id_fkey" FOREIGN key ("A") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "country_to_service"
DROP CONSTRAINT "country_to_service_B_services_id_fkey",
ADD CONSTRAINT "country_to_service_B_services_id_fkey" FOREIGN key ("B") REFERENCES "services" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "country_to_software"
DROP CONSTRAINT "country_to_software_A_countries_id_fkey",
ADD CONSTRAINT "country_to_software_A_countries_id_fkey" FOREIGN key ("A") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "country_to_software"
DROP CONSTRAINT "country_to_software_B_software_id_fkey",
ADD CONSTRAINT "country_to_software_B_software_id_fkey" FOREIGN key ("B") REFERENCES "software" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "institution_to_person"
DROP CONSTRAINT "institution_to_person_A_institutions_id_fkey",
ADD CONSTRAINT "institution_to_person_A_institutions_id_fkey" FOREIGN key ("A") REFERENCES "institutions" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "institution_to_person"
DROP CONSTRAINT "institution_to_person_B_persons_id_fkey",
ADD CONSTRAINT "institution_to_person_B_persons_id_fkey" FOREIGN key ("B") REFERENCES "persons" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "projects"
DROP CONSTRAINT "projects_report_id_reports_id_fkey",
ADD CONSTRAINT "projects_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "reports"
DROP CONSTRAINT "reports_country_id_countries_id_fkey",
ADD CONSTRAINT "reports_country_id_countries_id_fkey" FOREIGN key ("country_id") REFERENCES "countries" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

--> statement-breakpoint
ALTER TABLE "research_policy_developments"
DROP CONSTRAINT "research_policy_developments_report_id_reports_id_fkey",
ADD CONSTRAINT "research_policy_developments_report_id_reports_id_fkey" FOREIGN key ("report_id") REFERENCES "reports" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "services"
DROP CONSTRAINT "services_size_id_service_sizes_id_fkey",
ADD CONSTRAINT "services_size_id_service_sizes_id_fkey" FOREIGN key ("size_id") REFERENCES "service_sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
DROP SCHEMA "dariah_unr";
