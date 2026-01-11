ALTER TABLE "role_values" RENAME TO "role_type_values";

ALTER TABLE "event_size_values"
ALTER COLUMN "id"
SET DEFAULT gen_random_uuid();

ALTER TABLE "event_size_values"
ALTER COLUMN "created_at"
SET DEFAULT now();

ALTER TABLE "event_size_values"
ALTER COLUMN "updated_at"
SET DEFAULT now();

ALTER TABLE "outreach_type_values"
ALTER COLUMN "id"
SET DEFAULT gen_random_uuid();

ALTER TABLE "outreach_type_values"
ALTER COLUMN "created_at"
SET DEFAULT now();

ALTER TABLE "outreach_type_values"
ALTER COLUMN "updated_at"
SET DEFAULT now();

ALTER TABLE "role_type_values"
ALTER COLUMN "id"
SET DEFAULT gen_random_uuid();

ALTER TABLE "role_type_values"
ALTER COLUMN "created_at"
SET DEFAULT now();

ALTER TABLE "role_type_values"
ALTER COLUMN "updated_at"
SET DEFAULT now();

ALTER TABLE "service_size_values"
ALTER COLUMN "id"
SET DEFAULT gen_random_uuid();

ALTER TABLE "service_size_values"
ALTER COLUMN "created_at"
SET DEFAULT now();

ALTER TABLE "service_size_values"
ALTER COLUMN "updated_at"
SET DEFAULT now();

INSERT INTO "event_size_values" ("report_campaign_id", "annual_value", "type")
SELECT "report_campaigns"."id", 0, es.value
FROM "report_campaigns"
CROSS JOIN LATERAL unnest(enum_range(NULL::event_size)) AS es(value);

INSERT INTO "outreach_type_values" ("report_campaign_id", "annual_value", "type")
SELECT "report_campaigns"."id", 0, es.value
FROM "report_campaigns"
CROSS JOIN LATERAL unnest(enum_range(NULL::outreach_type)) AS es(value);

INSERT INTO "role_type_values" ("report_campaign_id", "annual_value", "type")
SELECT "report_campaigns"."id", 0, es.value
FROM "report_campaigns"
CROSS JOIN LATERAL unnest(enum_range(NULL::role_type)) AS es(value);

INSERT INTO "service_size_values" ("report_campaign_id", "annual_value", "type")
SELECT "report_campaigns"."id", 0, es.value
FROM "report_campaigns"
CROSS JOIN LATERAL unnest(enum_range(NULL::service_size)) AS es(value);
