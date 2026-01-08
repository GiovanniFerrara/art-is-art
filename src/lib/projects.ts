import type { Project, ProjectMedia } from './types';
import { defaultLocale, type Locale } from './i18n';

interface ProjectModule {
	metadata: {
		title: string;
		date: string;
		category: string;
		thumbnail: ProjectMedia;
		media: ProjectMedia[];
		description?: string;
	};
	default: unknown;
}

export async function getProjects(locale: Locale = defaultLocale): Promise<Project[]> {
	const modules = import.meta.glob<ProjectModule>('/src/content/**/projects/*.md', { eager: true });

	// Get all projects for the requested locale, falling back to default locale
	const projectMap = new Map<string, Project>();

	// First, add all default locale projects
	Object.entries(modules).forEach(([path, module]) => {
		if (!path.includes(`/content/${defaultLocale}/projects/`)) return;
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const { title, date, category, thumbnail, media, description } = module.metadata;
		projectMap.set(slug, { slug, title, date, category, thumbnail, media, description });
	});

	// Then override with locale-specific versions if they exist
	if (locale !== defaultLocale) {
		Object.entries(modules).forEach(([path, module]) => {
			if (!path.includes(`/content/${locale}/projects/`)) return;
			const slug = path.split('/').pop()?.replace('.md', '') ?? '';
			const { title, date, category, thumbnail, media, description } = module.metadata;
			projectMap.set(slug, { slug, title, date, category, thumbnail, media, description });
		});
	}

	const projects = Array.from(projectMap.values());

	// Sort by date, newest first
	return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
