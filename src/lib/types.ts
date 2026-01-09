export interface ProjectMedia {
	type: 'image' | 'video';
	src: string;
	alt?: string;
	poster?: string; // for videos
	caption?: string;
}

export interface Project {
	slug: string;
	title: string;
	date: string;
	category: string;
	medium?: string;
	thumbnail: ProjectMedia;
	media: ProjectMedia[];
	description?: string;
	shortDescription?: string;
}
