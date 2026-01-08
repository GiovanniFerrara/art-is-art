<script lang="ts">
  import { page } from '$app/stores';
  import { t, getLocalizedPath, getPathWithoutLocale, type Locale } from '$lib/i18n';
  import LanguageSelector from './LanguageSelector.svelte';

  let { locale }: { locale: Locale } = $props();

  function isActive(path: string): boolean {
    const currentPath = getPathWithoutLocale($page.url.pathname);
    return currentPath === path || (path === '/' && currentPath === '');
  }

  function href(path: string): string {
    return getLocalizedPath(path, locale);
  }
</script>

<nav>
  <div class="nav-links">
    <a href={href('/')} class:active={isActive('/')}>{t(locale, 'nav.work')}</a>
    <a href={href('/about')} class:active={isActive('/about')}>{t(locale, 'nav.about')}</a>
    <a href={href('/manifesto')} class:active={isActive('/manifesto')}>{t(locale, 'nav.manifesto')}</a>
    <a href={href('/contact')} class:active={isActive('/contact')}>{t(locale, 'nav.contact')}</a>
  </div>
  <LanguageSelector {locale} />
</nav>

<style>
  nav {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 1.5rem 1rem;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    text-transform: lowercase;
    transition: color 0.2s ease;
  }

  a:hover,
  a.active {
    color: var(--text);
  }

  @media (min-width: 768px) {
    nav {
      gap: 3rem;
    }

    .nav-links {
      gap: 3rem;
    }
  }
</style>
