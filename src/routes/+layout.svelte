<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import BubbleOverlay from "$lib/components/BubbleOverlay.svelte";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>gian marco ferrara</title>
</svelte:head>

<BubbleOverlay />
<ThemeToggle />

<Nav locale={data.locale} />

<main>
  {@render children()}
</main>

<Footer />

<style>
  main {
    min-height: 100vh;
    position: relative;
    z-index: 1001;
  }
</style>
