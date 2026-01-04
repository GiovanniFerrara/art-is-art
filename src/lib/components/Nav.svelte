<script lang="ts">
  import { page } from '$app/stores';
</script>

<nav>
  <a href="/" class:active={$page.url.pathname === '/'}>work</a>
  <a href="/about" class:active={$page.url.pathname === '/about'}>about</a>
  <a href="/manifesto" class:active={$page.url.pathname === '/manifesto'}>manifesto</a>
  <a href="/contact" class:active={$page.url.pathname === '/contact'}>contact</a>
</nav>

<style>
  nav {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1.5rem 1rem;
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
  }
</style>
