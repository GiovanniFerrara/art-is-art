import { getProjects } from '$lib/projects';
import { locales, type Locale } from '$lib/i18n';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, parent }) => {
	const { locale } = await parent();

	// Validate lang param if present
	if (params.lang && !locales.includes(params.lang as Locale)) {
		throw error(404, 'Not found');
	}

	const projects = await getProjects(locale);
	return { projects };
};
