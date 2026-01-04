<script lang="ts">
	import type { ProjectMedia } from '$lib/types';

	interface Props {
		media: ProjectMedia;
		title: string;
	}

	let { media, title }: Props = $props();
	let videoEl: HTMLVideoElement | undefined = $state();
	let isHovering = $state(false);

	function handleMouseEnter() {
		isHovering = true;
		if (videoEl && media.type === 'video') {
			videoEl.play();
		}
	}

	function handleMouseLeave() {
		isHovering = false;
		if (videoEl && media.type === 'video') {
			videoEl.pause();
			videoEl.currentTime = 0;
		}
	}
</script>

<div
	class="thumbnail"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="img"
	aria-label={title}
>
	{#if media.type === 'video'}
		<video
			bind:this={videoEl}
			src={media.src}
			poster={media.poster}
			muted
			loop
			playsinline
			preload="metadata"
		></video>
		<div class="video-indicator" class:playing={isHovering}>
			<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
				<path d="M8 5v14l11-7z" />
			</svg>
		</div>
	{:else}
		<img src={media.src} alt={media.alt ?? title} loading="lazy" />
	{/if}
</div>

<style>
	.thumbnail {
		position: relative;
		width: 100%;
		aspect-ratio: 4/3;
		overflow: hidden;
		background: #f0f0f0;
	}

	.thumbnail img,
	.thumbnail video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.thumbnail:hover img,
	.thumbnail:hover video {
		transform: scale(1.05);
	}

	.video-indicator {
		position: absolute;
		bottom: 0.75rem;
		right: 0.75rem;
		width: 2rem;
		height: 2rem;
		background: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		transition: opacity 0.2s ease;
	}

	.video-indicator svg {
		width: 1rem;
		height: 1rem;
		margin-left: 2px;
	}

	.video-indicator.playing {
		opacity: 0;
	}
</style>
