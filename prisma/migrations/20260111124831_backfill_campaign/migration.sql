ALTER TABLE "report_campaigns"
ALTER COLUMN "id"
SET DEFAULT gen_random_uuid();

ALTER TABLE "report_campaigns"
ALTER COLUMN "created_at"
SET DEFAULT now();

ALTER TABLE "report_campaigns"
ALTER COLUMN "updated_at"
SET DEFAULT now();

--

INSERT INTO "report_campaigns" ("year", "service_size_thresholds")
SELECT DISTINCT "reports"."year", '{}'::jsonb
FROM "reports"
LEFT JOIN "report_campaigns" ON "report_campaigns"."year" = "reports"."year"
WHERE "report_campaigns"."id" IS NULL;

--

UPDATE "reports"
SET "report_campaign_id" = "report_campaigns"."id"
FROM "report_campaigns"
WHERE "report_campaigns"."year" = "reports"."year"
  AND "reports"."report_campaign_id" IS NULL;
