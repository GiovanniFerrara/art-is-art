<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import BubbleOverlay from '$lib/components/BubbleOverlay.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>art is art</title>
</svelte:head>

<BubbleOverlay />

<main>
	{@render children()}
</main>

<style>
	main {
		min-height: 100vh;
		position: relative;
		z-index: 1;
	}
</style>
