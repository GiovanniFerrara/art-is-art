import type { Component } from 'svelte';
import { defaultLocale, type Locale } from './i18n';

interface PageModule {
	metadata: Record<string, unknown>;
	default: Component;
}

export async function getPageContent(
	page: 'about' | 'contact',
	locale: Locale = defaultLocale
): Promise<{
	metadata: Record<string, unknown>;
	Content: Component;
}> {
	const modules = import.meta.glob<PageModule>('/src/content/**/pages/*.md', { eager: true });

	// Try locale-specific content first, then fall back to default locale
	const localePath = `/src/content/${locale}/pages/${page}.md`;
	const defaultPath = `/src/content/${defaultLocale}/pages/${page}.md`;

	const module = modules[localePath] || modules[defaultPath];

	if (!module) {
		throw new Error(`Page content not found: ${page}`);
	}

	return {
		metadata: module.metadata,
		Content: module.default
	};
}
