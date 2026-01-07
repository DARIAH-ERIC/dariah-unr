import Script from "next/script";
import type { ReactNode } from "react";

declare global {
	interface Window {
		_paq?: Array<unknown>;
	}
}

interface AnalyticsScriptProps {
	baseUrl: string | undefined;
	id: number | undefined;
}

export function AnalyticsScript(props: Readonly<AnalyticsScriptProps>): ReactNode {
	const { baseUrl, id } = props;

	if (baseUrl == null || id == null) return null;

	return (
		<Script
			// eslint-disable-next-line @eslint-react/dom/no-dangerously-set-innerhtml
			dangerouslySetInnerHTML={{
				__html: `(${String(createAnalyticsScript)})("${baseUrl}", "${String(id)}");`,
			}}
			id="analytics-script"
		/>
	);
}

function createAnalyticsScript(baseUrl: string, id: number): void {
	const _paq = (window._paq = window._paq ?? []);
	_paq.push(["disableCookies"]);
	_paq.push(["enableHeartBeatTimer"]);
	const u = baseUrl;
	_paq.push(["setTrackerUrl", `${u}matomo.php`]);
	_paq.push(["setSiteId", id]);
	const d = document,
		g = d.createElement("script"),
		s = d.getElementsByTagName("script")[0];
	g.async = true;
	g.src = `${u}matomo.js`;
	s?.parentNode?.insertBefore(g, s);
}
