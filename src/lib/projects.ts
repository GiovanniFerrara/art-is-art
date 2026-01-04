import type { Project, ProjectMedia } from './types';

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

export async function getProjects(): Promise<Project[]> {
	const modules = import.meta.glob<ProjectModule>('/src/content/projects/*.md', { eager: true });

	const projects: Project[] = Object.entries(modules).map(([path, module]) => {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const { title, date, category, thumbnail, media, description } = module.metadata;

		return {
			slug,
			title,
			date,
			category,
			thumbnail,
			media,
			description
		};
	});

	// Sort by date, newest first
	return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
