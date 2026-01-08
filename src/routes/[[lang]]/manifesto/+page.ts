import { getPageContent } from '$lib/content';
import { locales, type Locale } from '$lib/i18n';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { locale } = await parent();

	if (params.lang && !locales.includes(params.lang as Locale)) {
		throw error(404, 'Not found');
	}

	const { metadata, Content } = await getPageContent('manifesto', locale);
	return { metadata, Content };
};
