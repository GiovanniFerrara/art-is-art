<script lang="ts">
	import type { ProjectMedia } from '$lib/types';

	interface Props {
		media: ProjectMedia[];
		title: string;
	}

	let { media, title }: Props = $props();
	let currentIndex = $state(0);
	let sliderEl: HTMLElement;
	let videoEls: (HTMLVideoElement | null)[] = $state([]);
	let isPlaying: boolean[] = $state([]);

	function goTo(index: number) {
		// Pause current video if playing
		const currentMedia = media[currentIndex];
		if (currentMedia.type === 'video' && videoEls[currentIndex]) {
			videoEls[currentIndex]?.pause();
			isPlaying[currentIndex] = false;
		}

		currentIndex = index;
	}

	function next() {
		goTo((currentIndex + 1) % media.length);
	}

	function prev() {
		goTo((currentIndex - 1 + media.length) % media.length);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight') next();
		if (e.key === 'ArrowLeft') prev();
	}

	function togglePlay(index: number) {
		const video = videoEls[index];
		if (!video) return;

		if (video.paused) {
			video.play();
			isPlaying[index] = true;
		} else {
			video.pause();
			isPlaying[index] = false;
		}
	}

	function handleVideoEnded(index: number) {
		isPlaying[index] = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="slider" bind:this={sliderEl}>
	<div class="slides" style="transform: translateX(-{currentIndex * 100}%)">
		{#each media as item, i}
			<div class="slide">
				{#if item.type === 'video'}
					{#if item.src.includes('youtube.com/embed')}
						<iframe
							src="{item.src}?controls=0&showinfo=0&rel=0&modestbranding=1"
							title="YouTube video player"
							frameborder="0"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							referrerpolicy="strict-origin-when-cross-origin"
							allowfullscreen
						></iframe>
					{:else}
						<div class="video-container">
							<video
								bind:this={videoEls[i]}
								src={item.src}
								poster={item.poster}
								loop
								playsinline
								preload="metadata"
								onended={() => handleVideoEnded(i)}
							></video>
							<button
								class="play-btn"
								class:playing={isPlaying[i]}
								onclick={() => togglePlay(i)}
								aria-label={isPlaying[i] ? 'Pause' : 'Play'}
							>
								{#if isPlaying[i]}
									<svg viewBox="0 0 24 24" fill="currentColor">
										<rect x="6" y="4" width="4" height="16" rx="1" />
										<rect x="14" y="4" width="4" height="16" rx="1" />
									</svg>
								{:else}
									<svg viewBox="0 0 24 24" fill="currentColor">
										<path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
									</svg>
								{/if}
							</button>
						</div>
					{/if}
				{:else}
					<img src={item.src} alt={item.alt ?? `${title} - ${i + 1}`} loading="lazy" />
				{/if}
				{#if item.caption}
					<figure class="caption" class:hidden={isPlaying[i]}>
						<img src={item.caption} alt="Caption" />
					</figure>
				{/if}
			</div>
		{/each}
	</div>

	{#if media.length > 1}
		<button class="nav-btn prev" onclick={prev} aria-label="Previous">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M15 19l-7-7 7-7" />
			</svg>
		</button>
		<button class="nav-btn next" onclick={next} aria-label="Next">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M9 5l7 7-7 7" />
			</svg>
		</button>

		<div class="dots">
			{#each media as _, i}
				<button
					class="dot"
					class:active={i === currentIndex}
					onclick={() => goTo(i)}
					aria-label={`Go to slide ${i + 1}`}
				></button>
			{/each}
		</div>

		<div class="counter">
			{currentIndex + 1} / {media.length}
		</div>
	{/if}
</div>

<style>
	.slider {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.slides {
		display: flex;
		height: 100%;
		transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.slide {
		flex-shrink: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slide img,
	.slide video,
	.slide iframe {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.slide iframe {
		width: 100%;
		aspect-ratio: 16 / 9;
		border: none;
	}

	.video-container {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.video-container video {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}

	.play-btn {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 5rem;
		height: 5rem;
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.4);
		backdrop-filter: blur(8px);
		color: rgba(255, 255, 255, 0.9);
		cursor: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		opacity: 1;
		z-index: 10;
	}

	.play-btn:hover {
		background: rgba(0, 0, 0, 0.6);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translate(-50%, -50%) scale(1.05);
	}

	.play-btn.playing {
		opacity: 0;
		pointer-events: none;
	}

	.video-container:hover .play-btn.playing {
		opacity: 1;
		pointer-events: auto;
	}

	.play-btn svg {
		width: 1.75rem;
		height: 1.75rem;
		margin-left: 0.2rem;
	}

	.play-btn.playing svg {
		margin-left: 0;
	}

	.nav-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 3rem;
		height: 3rem;
		border: none;
		background: transparent;
		color: var(--text-muted);
		cursor: none;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease;
	}

	.nav-btn:hover {
		color: var(--text);
	}

	.nav-btn svg {
		width: 1.5rem;
		height: 1.5rem;
	}

	.prev {
		left: 1rem;
	}

	.next {
		right: 1rem;
	}

	.dots {
		position: absolute;
		bottom: 1.5rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border-radius: 50%;
		border: none;
		background: var(--text-muted);
		opacity: 0.4;
		cursor: none;
		transition: opacity 0.2s ease;
	}

	.dot.active {
		opacity: 1;
	}

	.counter {
		position: absolute;
		bottom: 1.5rem;
		right: 1.5rem;
		font-size: 0.75rem;
		color: var(--text-muted);
		letter-spacing: 0.1em;
	}

	.caption {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0;
		transition: opacity 0.3s ease;
	}

	.caption.hidden {
		opacity: 0;
		pointer-events: none;
	}

	.caption img {
		width: 100%;
		height: auto;
		display: block;
	}
</style>
