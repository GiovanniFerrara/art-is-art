<script lang="ts">
	let { data } = $props();
	let { project } = data;

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long'
		});
	}
</script>

<svelte:head>
	<title>{project.title} - art is art</title>
</svelte:head>

<article class="project-page">
	<header>
		<a href="/" class="back-link">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M19 12H5M12 19l-7-7 7-7" />
			</svg>
			<span>Back</span>
		</a>
		<div class="project-info">
			<h1>{project.title}</h1>
			<div class="meta">
				<span class="category">{project.category}</span>
				<span class="separator">/</span>
				<time datetime={project.date}>{formatDate(project.date)}</time>
			</div>
		</div>
	</header>

	<div class="media-grid">
		{#each project.media as media, i}
			<figure class="media-item">
				{#if media.type === 'video'}
					<video
						src={media.src}
						poster={media.poster}
						muted
						loop
						playsinline
						controls
						preload="metadata"
					></video>
				{:else}
					<img src={media.src} alt={media.alt ?? project.title} loading="lazy" />
				{/if}
			</figure>
		{/each}
	</div>
</article>

<style>
	.project-page {
		min-height: 100vh;
		padding: 1.5rem 1rem 3rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	header {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: var(--text-muted);
		text-decoration: none;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--text);
	}

	.back-link svg {
		width: 1.25rem;
		height: 1.25rem;
	}

	.project-info {
		max-width: 600px;
	}

	h1 {
		font-size: clamp(1.75rem, 5vw, 2.5rem);
		font-weight: 300;
		color: var(--text);
		margin: 0 0 0.75rem 0;
		letter-spacing: 0.02em;
	}

	.meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.875rem;
		color: var(--text-muted);
	}

	.category {
		text-transform: lowercase;
	}

	.separator {
		opacity: 0.4;
	}

	.media-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.media-item {
		margin: 0;
		border-radius: 4px;
		overflow: hidden;
		background: var(--card-bg);
	}

	.media-item img,
	.media-item video {
		width: 100%;
		height: auto;
		display: block;
	}

	.media-item video {
		background: #000;
	}

	@media (min-width: 768px) {
		.project-page {
			padding: 2rem 2rem 4rem;
		}

		header {
			margin-bottom: 3rem;
		}

		.back-link {
			margin-bottom: 2rem;
		}

		.media-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 1.5rem;
		}

		.media-item:first-child {
			grid-column: 1 / -1;
		}
	}

	@media (min-width: 1024px) {
		.media-grid {
			gap: 2rem;
		}
	}
</style>
