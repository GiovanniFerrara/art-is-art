<script lang="ts">
  import MediaSlider from "$lib/components/MediaSlider.svelte";
  import type { Project } from "$lib/types";

  let { data } = $props();
  let selectedSlug = $state(data.projects[0]?.slug);
  let isDescriptionExpanded = $state(false);

  // Derived: get the current project from data.projects based on slug
  // This ensures the project updates when language changes
  let selectedProject: Project = $derived(
    data.projects.find((p) => p.slug === selectedSlug) ?? data.projects[0]
  );

  const MAX_SHORT_LENGTH = 300;

  function selectProject(project: Project) {
    selectedSlug = project.slug;
    isDescriptionExpanded = false;
  }

  function toggleDescription() {
    isDescriptionExpanded = !isDescriptionExpanded;
  }

  function getShortDescription(project: Project): string {
    if (project.shortDescription) return project.shortDescription;
    if (!project.description) return '';
    if (project.description.length <= MAX_SHORT_LENGTH) return project.description;
    return project.description.slice(0, MAX_SHORT_LENGTH).trim() + '...';
  }

  function hasLongDescription(project: Project): boolean {
    if (project.shortDescription && project.description) return true;
    return (project.description?.length ?? 0) > MAX_SHORT_LENGTH;
  }
</script>

<div class="home">
  <main class="viewer">
    {#key selectedProject.slug}
      <MediaSlider media={selectedProject.media} title={selectedProject.title} />
    {/key}
  </main>

  <aside class="sidebar">
    <nav class="project-list">
      {#each data.projects as project (project.slug)}
        <button
          class="project-item"
          class:active={selectedProject.slug === project.slug}
          onclick={() => selectProject(project)}
        >
          <span class="title">{project.title}</span>
          <span class="category">{project.category}</span>
        </button>
      {/each}
    </nav>

    {#key selectedProject.slug}
      <div class="project-info">
        <div class="project-meta">
          <span class="meta-item">
            <span class="meta-label">Year</span>
            <span class="meta-value">{new Date(selectedProject.date).getFullYear()}</span>
          </span>
          {#if selectedProject.medium}
            <span class="meta-item">
              <span class="meta-label">Medium</span>
              <span class="meta-value">{selectedProject.medium}</span>
            </span>
          {/if}
        </div>

        <div class="description-container">
          {#if isDescriptionExpanded}
            <p class="description">{selectedProject.description}</p>
          {:else}
            <p class="description">{getShortDescription(selectedProject)}</p>
          {/if}

          {#if hasLongDescription(selectedProject)}
            <button class="read-more" onclick={toggleDescription}>
              {isDescriptionExpanded ? '- Read Less' : '+ Read Full Statement'}
            </button>
          {/if}
        </div>
      </div>
    {/key}
  </aside>
</div>

<style>
  .home {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 8rem);
    min-height: 500px;
  }

  .viewer {
    flex: 1;
    min-width: 0;
    min-height: 50vh;
  }

  .sidebar {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    border-top: 1px solid var(--card-bg);
    max-height: 40vh;
    overflow-y: auto;
  }

  .project-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .project-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0.5rem 0;
    background: none;
    border: none;
    cursor: none;
    text-align: left;
    transition: opacity 0.2s ease;
  }

  .project-item:not(.active) {
    opacity: 0.35;
  }

  .project-item:hover {
    opacity: 0.7;
  }

  .project-item.active {
    opacity: 1;
  }

  .project-item .title {
    font-size: 1rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: 0.02em;
  }

  .project-item.active .title {
    font-weight: 500;
  }

  .project-item .category {
    font-size: 0.75rem;
    color: var(--text-muted);
    text-transform: lowercase;
    letter-spacing: 0.1em;
  }

  .project-info {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .project-meta {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--card-bg);
  }

  .meta-item {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .meta-label {
    font-size: 0.625rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  .meta-value {
    font-size: 0.875rem;
    color: var(--text);
  }

  .description-container {
    display: flex;
    flex-direction: column;
  }

  .description {
    font-size: 0.875rem;
    line-height: 1.8;
    color: var(--text);
    margin: 0;
    white-space: pre-line;
  }

  .read-more {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 0.75rem;
    letter-spacing: 0.1em;
    padding: 0.75rem 0 0;
    cursor: none;
    text-align: left;
    transition: color 0.2s ease;
  }

  .read-more:hover {
    color: var(--text);
  }

  @media (min-width: 769px) {
    .home {
      flex-direction: row;
    }

    .viewer {
      order: 1;
      min-height: auto;
    }

    .sidebar {
      order: 2;
      width: 340px;
      border-top: none;
      border-left: 1px solid var(--card-bg);
      padding: 2rem;
      max-height: none;
      overflow-y: visible;
    }

    .project-list {
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 0;
    }

    .project-item {
      padding: 0.75rem 0;
    }

    .project-info {
      margin-top: auto;
      padding-top: 2rem;
    }
  }
</style>
