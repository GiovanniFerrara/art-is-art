import { getLocaleFromPath, type Locale } from '$lib/i18n';

export function load({ url }) {
	const locale: Locale = getLocaleFromPath(url.pathname);
	return { locale };
}
