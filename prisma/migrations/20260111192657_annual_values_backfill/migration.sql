UPDATE "event_size_values"
SET "annual_value" = 1000
WHERE "type" = 'small';

UPDATE "event_size_values"
SET "annual_value" = 5000
WHERE "type" = 'medium';

UPDATE "event_size_values"
SET "annual_value" = 10000
WHERE "type" = 'large';

UPDATE "event_size_values"
SET "annual_value" = 50000
WHERE "type" = 'dariah_commissioned';

--

UPDATE "outreach_type_values"
SET "annual_value" = 5000
WHERE "type" = 'national_website';

UPDATE "outreach_type_values"
SET "annual_value" = 2000
WHERE "type" = 'social_media';

--

UPDATE "role_type_values"
SET "annual_value" = 7500
WHERE "type" = 'jrc_member';

UPDATE "role_type_values"
SET "annual_value" = 5000
WHERE "type" = 'wg_chair';

UPDATE "role_type_values"
SET "annual_value" = 10000
WHERE "type" = 'national_coordinator';

--

UPDATE "service_size_values"
SET "annual_value" = 75000
WHERE "type" = 'core';

UPDATE "service_size_values"
SET "annual_value" = 37500
WHERE "type" = 'large';

UPDATE "service_size_values"
SET "annual_value" = 18750
WHERE "type" = 'medium';

UPDATE "service_size_values"
SET "annual_value" = 6250
WHERE "type" = 'small';
