import type { Component } from 'svelte';

interface PageModule {
	metadata: Record<string, unknown>;
	default: Component;
}

export async function getPageContent(page: 'about' | 'manifesto' | 'contact'): Promise<{
	metadata: Record<string, unknown>;
	Content: Component;
}> {
	const modules = import.meta.glob<PageModule>('/src/content/pages/*.md', { eager: true });
	const module = modules[`/src/content/pages/${page}.md`];

	if (!module) {
		throw new Error(`Page content not found: ${page}`);
	}

	return {
		metadata: module.metadata,
		Content: module.default
	};
}
