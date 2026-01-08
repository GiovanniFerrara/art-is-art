<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>{data.metadata.title} | gian marco ferrara</title>
</svelte:head>

<article class="page">
  <data.Content />
</article>

<style>
  .page {
    max-width: 65ch;
    margin: 0 auto;
    padding: 2rem 1.5rem 4rem;
  }

  .page :global(h1) {
    font-size: clamp(1.5rem, 5vw, 2.5rem);
    font-weight: 200;
    letter-spacing: 0.1em;
    margin-bottom: 2rem;
    color: var(--text);
  }

  .page :global(h2) {
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.15em;
    text-transform: lowercase;
    color: var(--text-muted);
    margin: 2.5rem 0 1rem;
  }

  .page :global(p) {
    color: var(--text);
    line-height: 1.8;
    margin-bottom: 1.25rem;
  }

  .page :global(hr) {
    border: none;
    border-top: 1px solid var(--text-muted);
    opacity: 0.3;
    margin: 2.5rem 0;
  }

  .page :global(strong) {
    font-weight: 500;
  }

  .page :global(em) {
    font-style: italic;
    color: var(--text-muted);
  }

  .page :global(a) {
    color: var(--text);
    text-decoration: underline;
    text-underline-offset: 0.2em;
    transition: opacity 0.2s ease;
  }

  .page :global(a:hover) {
    opacity: 0.7;
  }

  @media (min-width: 768px) {
    .page {
      padding: 3rem 2rem 6rem;
    }
  }
</style>
