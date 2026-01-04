<script lang="ts">
	import type { Project } from '$lib/types';
	import ProjectCard from './ProjectCard.svelte';

	interface Props {
		projects: Project[];
	}

	let { projects }: Props = $props();
</script>

<section class="gallery">
	{#each projects as project (project.slug)}
		<ProjectCard {project} />
	{/each}
</section>

<style>
	.gallery {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 1.5rem;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	@media (min-width: 480px) {
		.gallery {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 768px) {
		.gallery {
			grid-template-columns: repeat(3, 1fr);
			gap: 2rem;
			padding: 0 2rem;
		}
	}

	@media (min-width: 1200px) {
		.gallery {
			grid-template-columns: repeat(4, 1fr);
		}
	}
</style>
