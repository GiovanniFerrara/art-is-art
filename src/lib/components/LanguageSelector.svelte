<script lang="ts">
  import { page } from '$app/stores';
  import { locales, localeNames, getLocalizedPath, type Locale } from '$lib/i18n';

  let { locale }: { locale: Locale } = $props();

  function getHref(targetLocale: Locale): string {
    return getLocalizedPath($page.url.pathname, targetLocale);
  }
</script>

<div class="language-selector">
  {#each locales as lang}
    <a
      href={getHref(lang)}
      class:active={locale === lang}
      aria-current={locale === lang ? 'page' : undefined}
    >
      {lang}
    </a>
  {/each}
</div>

<style>
  .language-selector {
    display: flex;
    gap: 0.75rem;
  }

  a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: color 0.2s ease;
  }

  a:hover,
  a.active {
    color: var(--text);
  }
</style>
