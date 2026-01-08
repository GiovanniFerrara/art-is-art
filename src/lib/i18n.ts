export const locales = ['en', 'fr', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
	en: 'English',
	fr: 'Français',
	it: 'Italiano'
};

export const ui: Record<Locale, Record<string, string>> = {
	en: {
		'nav.work': 'work',
		'nav.about': 'about',
		'nav.manifesto': 'manifesto',
		'nav.contact': 'contact'
	},
	fr: {
		'nav.work': 'travaux',
		'nav.about': 'à propos',
		'nav.manifesto': 'manifeste',
		'nav.contact': 'contact'
	},
	it: {
		'nav.work': 'lavori',
		'nav.about': 'chi sono',
		'nav.manifesto': 'manifesto',
		'nav.contact': 'contatti'
	}
};

export function t(locale: Locale, key: string): string {
	return ui[locale][key] || ui[defaultLocale][key] || key;
}

export function getLocaleFromPath(pathname: string): Locale {
	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0] as Locale;
	if (locales.includes(firstSegment)) {
		return firstSegment;
	}
	return defaultLocale;
}

export function getPathWithoutLocale(pathname: string): string {
	const segments = pathname.split('/').filter(Boolean);
	const firstSegment = segments[0] as Locale;
	if (locales.includes(firstSegment)) {
		return '/' + segments.slice(1).join('/');
	}
	return pathname;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
	const pathWithoutLocale = getPathWithoutLocale(pathname);
	if (locale === defaultLocale) {
		return pathWithoutLocale || '/';
	}
	return `/${locale}${pathWithoutLocale}`;
}
