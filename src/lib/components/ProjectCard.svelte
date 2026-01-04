<script lang="ts">
	import type { Project } from '$lib/types';
	import MediaThumbnail from './MediaThumbnail.svelte';

	interface Props {
		project: Project;
	}

	let { project }: Props = $props();
</script>

<article class="project-card">
	<a href="/projects/{project.slug}">
		<MediaThumbnail media={project.thumbnail} title={project.title} />
		<div class="info">
			<h2>{project.title}</h2>
			<span class="category">{project.category}</span>
		</div>
	</a>
</article>

<style>
	.project-card {
		background: var(--card-bg);
		border-radius: 4px;
		overflow: hidden;
		box-shadow: 0 1px 3px var(--card-shadow);
		transition:
			box-shadow 0.3s ease,
			transform 0.3s ease,
			background 0.3s ease;
	}

	.project-card:hover {
		box-shadow: 0 4px 20px var(--card-shadow);
		transform: translateY(-2px);
	}

	.project-card a {
		text-decoration: none;
		color: inherit;
		display: block;
	}

	.info {
		padding: 1rem;
	}

	h2 {
		font-size: 1rem;
		font-weight: 500;
		margin: 0 0 0.25rem 0;
		color: var(--text);
	}

	.category {
		font-size: 0.75rem;
		color: var(--text-muted);
		text-transform: lowercase;
	}
</style>
