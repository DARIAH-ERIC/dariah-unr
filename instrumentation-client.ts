import * as Sentry from "@sentry/nextjs";

import { env } from "@/config/env.config";

Sentry.init({
	dsn: env.NEXT_PUBLIC_APP_SENTRY_DSN,
	enableLogs: true,
	integrations: [Sentry.replayIntegration()],
	replaysOnErrorSampleRate: 1,
	replaysSessionSampleRate: 0.1,
	/**
	 * Enable sending personally identifiable information.
	 *
	 * @see {@link https://docs.sentry.io/platforms/javascript/guides/nextjs/data-management/data-collected/}
	 */
	sendDefaultPii: env.NEXT_PUBLIC_APP_SENTRY_PII === "enabled",
	tracesSampleRate: 0.1,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
