import { getPageContent } from '$lib/content';

export async function load() {
	const { metadata, Content } = await getPageContent('manifesto');
	return { metadata, Content };
}
