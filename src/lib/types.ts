export interface ProjectMedia {
	type: 'image' | 'video';
	src: string;
	alt?: string;
	poster?: string; // for videos
}

export interface Project {
	slug: string;
	title: string;
	date: string;
	category: string;
	thumbnail: ProjectMedia;
	media: ProjectMedia[];
	description?: string;
}
