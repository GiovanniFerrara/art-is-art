<script lang="ts">
  import Gallery from "$lib/components/Gallery.svelte";

  let { data } = $props();
</script>

<div class="content">
  <header>
    <h1>gian marco ferrara</h1>
  </header>

  <Gallery projects={data.projects} />
</div>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 1rem 0 3rem;
  }

  header {
    text-align: center;
    padding: 2rem 1rem 3rem;
  }

  h1 {
    font-size: clamp(1.5rem, 6vw, 3rem);
    font-weight: 200;
    letter-spacing: 0.15em;
    color: var(--text);
    text-transform: lowercase;
    margin: 0;
  }

  @media (min-width: 768px) {
    .content {
      padding: 2rem 0 4rem;
    }

    header {
      padding: 3rem 2rem 4rem;
    }
  }
</style>
