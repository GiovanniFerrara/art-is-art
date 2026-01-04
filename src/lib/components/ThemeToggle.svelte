<script lang="ts">
	import { browser } from '$app/environment';

	let isDark = $state(true);

	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('theme');
			isDark = saved ? saved === 'dark' : true;
			updateTheme();
		}
	});

	function updateTheme() {
		if (browser) {
			document.documentElement.classList.toggle('light', !isDark);
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		}
	}

	function toggle() {
		isDark = !isDark;
		updateTheme();
	}
</script>

<button
	onclick={toggle}
	class="theme-toggle"
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	{#if isDark}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<circle cx="12" cy="12" r="5" />
			<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
		</svg>
	{:else}
		<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	{/if}
</button>

<style>
	.theme-toggle {
		position: fixed;
		bottom: 1.5rem;
		right: 1.5rem;
		width: 2.5rem;
		height: 2.5rem;
		border: none;
		background: transparent;
		color: var(--text-muted);
		cursor: none;
		padding: 0.5rem;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.2s ease, opacity 0.2s ease;
		opacity: 0.5;
		z-index: 100;
	}

	.theme-toggle:hover {
		color: var(--text);
		opacity: 1;
	}

	.theme-toggle svg {
		width: 1.25rem;
		height: 1.25rem;
	}
</style>
