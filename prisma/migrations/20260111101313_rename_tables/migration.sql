ALTER TABLE "event_sizes" RENAME TO "event_size_values";
ALTER TABLE "service_sizes" RENAME TO "service_size_values";

ALTER TYPE "EventSizeType" RENAME TO "EventSize";
ALTER TYPE "ServiceSizeType" RENAME TO "ServiceSize";
