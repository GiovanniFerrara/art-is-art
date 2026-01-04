<script lang="ts">
  let { data } = $props();

  interface Social {
    platform: string;
    url: string;
  }

  const email = data.metadata.email as string;
  const social = data.metadata.social as Social[];
</script>

<svelte:head>
  <title>{data.metadata.title} | gian marco ferrara</title>
</svelte:head>

<article class="page">
  <data.Content />

  <div class="contact-links">
    {#if email}
      <a href="mailto:{email}" class="email">{email}</a>
    {/if}

    {#if social?.length}
      <div class="social">
        {#each social as link}
          <a href={link.url} target="_blank" rel="noopener noreferrer">
            {link.platform}
          </a>
        {/each}
      </div>
    {/if}
  </div>
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

  .page :global(p) {
    color: var(--text);
    line-height: 1.8;
    margin-bottom: 1.25rem;
  }

  .contact-links {
    margin-top: 3rem;
  }

  .email {
    display: block;
    color: var(--text);
    font-size: 1.125rem;
    letter-spacing: 0.05em;
    text-decoration: none;
    margin-bottom: 2rem;
    transition: opacity 0.2s ease;
  }

  .email:hover {
    opacity: 0.7;
  }

  .social {
    display: flex;
    gap: 1.5rem;
  }

  .social a {
    color: var(--text-muted);
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    text-transform: lowercase;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .social a:hover {
    color: var(--text);
  }

  @media (min-width: 768px) {
    .page {
      padding: 3rem 2rem 6rem;
    }
  }
</style>
