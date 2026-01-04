import type { Project, ProjectMedia } from '$lib/types';
import { error } from '@sveltejs/kit';

interface ProjectModule {
	metadata: {
		title: string;
		date: string;
		category: string;
		thumbnail: ProjectMedia;
		media: ProjectMedia[];
	};
	default: unknown;
}

export async function load({ params }) {
	const modules = import.meta.glob<ProjectModule>('/src/content/projects/*.md', { eager: true });

	const path = `/src/content/projects/${params.slug}.md`;
	const module = modules[path];

	if (!module) {
		throw error(404, 'Project not found');
	}

	const { title, date, category, thumbnail, media } = module.metadata;

	const project: Project = {
		slug: params.slug,
		title,
		date,
		category,
		thumbnail,
		media
	};

	return { project };
}
