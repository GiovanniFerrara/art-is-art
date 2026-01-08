<script lang="ts">
  import { page } from "$app/stores";
  import {
    t,
    getLocalizedPath,
    getPathWithoutLocale,
    type Locale,
  } from "$lib/i18n";
  import LanguageSelector from "./LanguageSelector.svelte";

  let { locale }: { locale: Locale } = $props();

  function isActive(path: string): boolean {
    const currentPath = getPathWithoutLocale($page.url.pathname);
    return currentPath === path || (path === "/" && currentPath === "");
  }

  function href(path: string): string {
    return getLocalizedPath(path, locale);
  }
</script>

<nav>
  <a href={href("/")} class="brand">
    <span class="name">GIAN MARCO FERRARA</span>
    <span class="subtitle">Digital & Performance Art</span>
  </a>
  <div class="nav-links">
    <a href={href("/")} class:active={isActive("/")}>{t(locale, "nav.work")}</a>
    <a href={href("/about")} class:active={isActive("/about")}
      >{t(locale, "nav.about")}</a
    >
    <a href={href("/manifesto")} class:active={isActive("/manifesto")}
      >{t(locale, "nav.manifesto")}</a
    >
    <a href={href("/contact")} class:active={isActive("/contact")}
      >{t(locale, "nav.contact")}</a
    >
  </div>
  <LanguageSelector {locale} />
</nav>

<style>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    padding: 1.5rem 2rem;
  }

  .brand {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    gap: 0.125rem;
  }

  .brand .name {
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.15em;
    color: var(--text);
  }

  .brand .subtitle {
    font-size: 0.625rem;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    text-transform: capitalize;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 0.875rem;
    letter-spacing: 0.1em;
    text-transform: lowercase;
    transition: color 0.2s ease;
  }

  .nav-links a:hover,
  .nav-links a.active {
    color: var(--text);
  }

  @media (max-width: 768px) {
    nav {
      flex-wrap: wrap;
      gap: 1rem;
      padding: 1rem;
    }

    .brand {
      width: 100%;
      text-align: center;
      align-items: center;
    }

    .nav-links {
      flex: 1;
      justify-content: center;
    }
  }

  @media (min-width: 769px) {
    nav {
      gap: 3rem;
    }

    .nav-links {
      gap: 3rem;
    }
  }
</style>
