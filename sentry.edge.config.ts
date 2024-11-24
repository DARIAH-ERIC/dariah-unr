import * as Sentry from "@sentry/nextjs";

Sentry.init({
	debug: false,
	dsn: "https://f17ca144b3c50570ee2deeac2c4cc132@o4504360778661888.ingest.us.sentry.io/4507129666338816",
	ignoreErrors: ["NEXT_NOT_FOUND"],
	tracesSampleRate: 1,
});
